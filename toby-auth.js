(function() {
  // Tijdelijke bypass voor development
  if (localStorage.getItem('toby_bypass') === 'true') {
    // Voeg uitlog knop toe
    document.addEventListener('DOMContentLoaded', function() {
      var header = document.querySelector('.hdr, .header');
      if (header) {
        var btn = document.createElement('button');
        btn.textContent = 'Uitloggen';
        btn.style.cssText = 'font-size:11px;font-family:DM Mono,monospace;background:none;border:0.5px solid rgba(0,0,0,0.12);border-radius:20px;padding:4px 12px;cursor:pointer;color:#8a8680;margin-left:8px';
        btn.onclick = function() {
          localStorage.removeItem('toby_bypass');
          window.location.href = 'toby-login.html';
        };
        header.appendChild(btn);
      }
    });
    return;
  }

  var SUPABASE_URL = 'https://nznsimwgjwkdvudcdmup.supabase.co';
  var SUPABASE_KEY = 'sb_publishable_yOUd6ZQRGxfUr-Yc9dDoDg_Rzwx1muZ';

  var script = document.createElement('script');
  script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
  script.onload = function() {
    var sb = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

    sb.auth.getSession().then(function(r) {
      if (!r.data.session) {
        var base = window.location.pathname.split('/').slice(0,-1).join('/') + '/';
        window.location.href = base + 'toby-login.html';
      } else {
        var header = document.querySelector('.hdr, .header');
        if (header) {
          var btn = document.createElement('button');
          btn.textContent = 'Uitloggen';
          btn.style.cssText = 'font-size:11px;font-family:DM Mono,monospace;background:none;border:0.5px solid rgba(0,0,0,0.12);border-radius:20px;padding:4px 12px;cursor:pointer;color:#8a8680;margin-left:8px';
          btn.onclick = function() {
            sb.auth.signOut().then(function() {
              var base = window.location.pathname.split('/').slice(0,-1).join('/') + '/';
              window.location.href = base + 'toby-login.html';
            });
          };
          header.appendChild(btn);
        }
      }
    });

    sb.auth.onAuthStateChange(function(event) {
      if (event === 'SIGNED_OUT') {
        var base = window.location.pathname.split('/').slice(0,-1).join('/') + '/';
        window.location.href = base + 'toby-login.html';
      }
    });
  };
  document.head.appendChild(script);
})();
