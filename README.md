# Henk Dashboard
### Hotel operatie op één plek

Een standalone dashboard-structuur voor independent hotelmanagers. Gebouwd als interactief HTML-prototype — geen server, geen dependencies, direct te openen in elke browser.

---

## Wat is dit?

Henk Dashboard is een concept voor een hotel operatie platform dat de manager centraal stelt in plaats van de receptie of het revenue team. Het brengt alle operationele, financiële, personele en compliance-taken samen in één interface.

Het huidige bestand (`index.html`) is een **klikbaar structuurdiagram** van het volledige platform — bedoeld als werkinstrument voor gesprekken met compagnons, investeerders en ontwikkelaars.

---

## Structuur van het platform

```
Ochtendblik (centrale hub)
│
├── Operatie          → PMS · kanaalbeheer · housekeeping · maintenance · sleutels
├── Financiën         → KPI's · netto resultaat · kostenbewaking · cashflow · Exact
├── Personeel         → Rooster · verzuim · BHV · onboarding · functionering
├── Compliance        → Vergunningen · inspecties · HACCP · incidenten · brandveiligheid
├── Reputatie         → Reviews · antwoord-status · sentiment · klachten
│
├── Inkoop & leveranciers
├── Communicatie & overdracht
├── Sales & relatiebeheer
├── Rapportage & management
└── Instellingen & beheer

AI-laag
├── Nachtassistent    → escalatie · noodprotocol · gast
├── Proactieve signalen → afwijkingen · vervaldatums · personeelsgaten
└── Manager briefing  → dagelijkse samenvatting · prioriteiten · beslissingen
```

---

## Bestanden

| Bestand | Omschrijving |
|---|---|
| `index.html` | Klikbaar structuurdiagram — volledig zelfstandig |
| `README.md` | Dit bestand |

---

## Lokaal gebruiken

Geen installatie nodig. Open `index.html` direct in je browser.

```bash
open index.html        # macOS
start index.html       # Windows
```

---

## Bekijken via GitHub Pages

Activeer GitHub Pages onder **Settings → Pages → Branch: main → / (root)**.

Na ~1 minuut bereikbaar op:
```
https://<jouwgebruikersnaam>.github.io/henk-dashboard/
```

---

## Integraties (gepland)

| Systeem | Type | Status |
|---|---|---|
| Mews PMS | REST API | Gepland |
| Shiftbase | REST API | Gepland |
| Exact Online | REST API | Gepland |
| Booking.com | XML/REST | Gepland |
| UCare4 | Export/webhook | Onderzoek |
| FoodDocs | REST API | Onderzoek |

---

## Roadmap

- [ ] Navigeerbaar HTML-prototype per module
- [ ] Ochtendblik live data (Mews koppeling)
- [ ] Financieel dagdashboard (RevPAR · ADR · bezetting)
- [ ] Compliance module (vergunningenregister · inspectielogboek)
- [ ] AI-laag nachtassistent
- [ ] Mobiele weergave

---

## Achtergrond

Ontwikkeld vanuit de praktijkervaring van een voormalig apartment hotel manager. Het platform richt zich op independent hotels van 20–100 kamers die draaien op meerdere losse systemen zonder centrale bestuurslaag.

Het concept is ontstaan naast [GuestCompass](https://guestcompass.app) — een hotel guest webapp met domotica en deur-toegang — en wordt ontwikkeld als aanvullend manager-gericht platform.

---

*Versie 0.1 — concept fase*
