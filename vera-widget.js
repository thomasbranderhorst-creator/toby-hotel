(function() {
  var SUPABASE_URL = 'https://nznsimwgjwkdvudcdmup.supabase.co';
  var SUPABASE_KEY = 'sb_publishable_yOUd6ZQRGxfUr-Yc9dDoDg_Rzwx1muZ';
  var HOTEL_ID = '6a0ba674-4bfc-44d8-bfcf-0b598d05e097';

  var style = document.createElement('style');
  style.textContent = `
    #vera-fab{position:fixed;bottom:24px;right:24px;z-index:9999;display:flex;flex-direction:column;align-items:flex-end;gap:8px}
    #vera-fab-btn{width:48px;height:48px;border-radius:50%;background:#6355e0;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:20px;box-shadow:0 4px 16px rgba(99,85,224,0.35);transition:transform .15s,box-shadow .15s;color:white;font-family:'DM Mono',monospace;font-weight:600;font-size:13px}
    #vera-fab-btn:hover{transform:scale(1.08);box-shadow:0 6px 20px rgba(99,85,224,0.45)}
    #vera-fab-btn.open{border-radius:12px;background:#5448c8}
    #vera-panel{display:none;width:320px;background:#fff;border:1px solid rgba(0,0,0,0.1);border-radius:14px;box-shadow:0 8px 32px rgba(0,0,0,0.12);overflow:hidden}
    #vera-panel.open{display:flex;flex-direction:column}
    #vera-panel-header{background:#6355e0;padding:12px 16px;display:flex;align-items:center;justify-content:space-between}
    #vera-panel-header span{font-size:13px;font-weight:600;color:white;font-family:'DM Sans',sans-serif}
    #vera-panel-header small{font-size:10px;color:rgba(255,255,255,0.7);font-family:'DM Mono',monospace}
    #vera-close{background:none;border:none;color:white;cursor:pointer;font-size:16px;padding:0;opacity:.7}
    #vera-close:hover{opacity:1}
    #vera-messages{padding:12px;max-height:280px;overflow-y:auto;display:flex;flex-direction:column;gap:8px;background:#f4f1ec}
    .vera-msg{padding:8px 12px;border-radius:10px;font-size:12px;line-height:1.6;font-family:'DM Sans',sans-serif;max-width:90%}
    .vera-msg.vera{background:#6355e0;color:white;border-radius:10px 10px 10px 2px;align-self:flex-start}
    .vera-msg.user{background:#ffffff;color:#1a1814;border:1px solid rgba(0,0,0,0.1);border-radius:10px 10px 2px 10px;align-self:flex-end}
    .vera-msg.loading{background:rgba(99,85,224,0.1);color:#6355e0;font-style:italic}
    #vera-input-row{display:flex;gap:6px;padding:10px;border-top:1px solid rgba(0,0,0,0.07);background:#fff}
    #vera-input{flex:1;border:1px solid rgba(0,0,0,0.12);border-radius:8px;padding:8px 12px;font-size:12px;font-family:'DM Sans',sans-serif;color:#1a1814;outline:none;background:#f4f1ec}
    #vera-input:focus{border-color:#6355e0;background:#fff}
    #vera-send{background:#6355e0;border:none;border-radius:8px;padding:8px 14px;color:white;font-size:12px;cursor:pointer;font-family:'DM Sans',sans-serif;white-space:nowrap}
    #vera-send:hover{background:#5448c8}
    #vera-send:disabled{opacity:.5;cursor:not-allowed}
    #vera-no-key{padding:10px 12px;font-size:11px;color:#c47c0a;background:rgba(196,124,10,0.08);border-top:1px solid rgba(196,124,10,0.2);font-family:'DM Mono',monospace;text-align:center;cursor:pointer}
    #vera-no-key:hover{background:rgba(196,124,10,0.15)}
  `;
  document.head.appendChild(style);

  var html = `
    <div id="vera-fab">
      <div id="vera-panel">
        <div id="vera-panel-header">
          <span>✨ Vera AI</span>
          <div style="display:flex;align-items:center;gap:10px">
            <small id="vera-page-context"></small>
            <button id="vera-close">✕</button>
          </div>
        </div>
        <div id="vera-messages">
          <div class="vera-msg vera">Hoi! Ik ben Vera. Wat wil je weten over het hotel?</div>
        </div>
        <div id="vera-input-row">
          <input id="vera-input" type="text" placeholder="Stel een vraag...">
          <button id="vera-send">Vraag</button>
        </div>
        <div id="vera-no-key" style="display:none">⚠ Geen API sleutel — klik om in te stellen</div>
      </div>
      <button id="vera-fab-btn" title="Vera AI">V</button>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', html);

  var isOpen = false;
  var conversationHistory = [];

  function getApiKey() {
    return localStorage.getItem('vera_anthropic_key') || '';
  }

  function getPageContext() {
    var title = document.title.replace('Vera — ', '').replace('Vera - ', '');
    return title;
  }

  async function getHotelContext() {
    var ctx = 'Hotel: Hotel De Klok, Amsterdam, 18 kamers.\n';
    try {
      var sb = window.supabase ? window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY) : null;
      if (!sb && window.supabase) sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
      if (sb) {
        var vandaag = new Date().toISOString().split('T')[0];
        var bez = await sb.from('mews_bezetting').select('*').eq('hotel_id', HOTEL_ID).eq('datum', vandaag).single();
        if (bez.data) ctx += 'MEWS: vandaag ' + bez.data.bezettingsgraad + '% bezet, ' + bez.data.aankomsten + ' aankomsten, ' + bez.data.vertrekken + ' vertrekken.\n';
        var comp = await sb.from('compliance_items').select('status').eq('hotel_id', HOTEL_ID);
        if (comp.data) {
          var groen = comp.data.filter(function(i){return i.status==='groen';}).length;
          var open = comp.data.filter(function(i){return i.status==='geen_document';}).length;
          ctx += 'COMPLIANCE: ' + groen + ' in orde, ' + open + ' items open.\n';
        }
      }
    } catch(e) {}
    ctx += 'Huidige module: ' + getPageContext() + '.\n';
    return ctx;
  }

  async function vraagVera(vraag) {
    var key = getApiKey();
    if (!key) {
      document.getElementById('vera-no-key').style.display = 'block';
      return;
    }
    var ctx = await getHotelContext();
    conversationHistory.push({ role: 'user', content: 'Data:\n' + ctx + '\nVraag: ' + vraag });

    var resp = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': key,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 400,
        system: 'Je bent Vera — operationele assistent van de hotelmanager van Hotel De Klok. Je bent de helikopterview voor de hotelmanager, operations manager en cluster manager. Je ziet alle systemen tegelijk: bezetting, financiën, compliance, personeel en reputatie. Spreek als een directe, ervaren collega. Geen disclaimers. Altijd Nederlands. Korte antwoorden.',
        messages: conversationHistory
      })
    });

    var data = await resp.json();
    var antwoord = data.content && data.content[0] ? data.content[0].text : 'Geen antwoord ontvangen.';
    conversationHistory.push({ role: 'assistant', content: antwoord });
    return antwoord;
  }

  function addMessage(tekst, type) {
    var msgs = document.getElementById('vera-messages');
    var div = document.createElement('div');
    div.className = 'vera-msg ' + type;
    div.textContent = tekst;
    msgs.appendChild(div);
    msgs.scrollTop = msgs.scrollHeight;
    return div;
  }

  async function handleVraag() {
    var input = document.getElementById('vera-input');
    var vraag = input.value.trim();
    if (!vraag) return;
    input.value = '';
    document.getElementById('vera-send').disabled = true;
    addMessage(vraag, 'user');
    var loading = addMessage('Vera denkt na...', 'vera loading');
    try {
      var antwoord = await vraagVera(vraag);
      loading.className = 'vera-msg vera';
      loading.textContent = antwoord;
    } catch(e) {
      loading.className = 'vera-msg vera';
      loading.textContent = 'Fout: ' + e.message;
    }
    document.getElementById('vera-send').disabled = false;
    input.focus();
  }

  document.getElementById('vera-fab-btn').addEventListener('click', function() {
    isOpen = !isOpen;
    document.getElementById('vera-panel').classList.toggle('open', isOpen);
    document.getElementById('vera-fab-btn').classList.toggle('open', isOpen);
    document.getElementById('vera-page-context').textContent = getPageContext();
    if (isOpen) document.getElementById('vera-input').focus();
    if (!getApiKey()) document.getElementById('vera-no-key').style.display = 'block';
  });

  document.getElementById('vera-close').addEventListener('click', function() {
    isOpen = false;
    document.getElementById('vera-panel').classList.remove('open');
    document.getElementById('vera-fab-btn').classList.remove('open');
  });

  document.getElementById('vera-send').addEventListener('click', handleVraag);
  document.getElementById('vera-input').addEventListener('keydown', function(e) {
    if (e.key === 'Enter') handleVraag();
  });

  document.getElementById('vera-no-key').addEventListener('click', function() {
    var key = prompt('Vul je Anthropic API sleutel in:');
    if (key && key.trim()) {
      localStorage.setItem('vera_anthropic_key', key.trim());
      document.getElementById('vera-no-key').style.display = 'none';
    }
  });
})();
