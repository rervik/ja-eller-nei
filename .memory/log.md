# Ja eller Nei – logg (fullførte oppgaver)

- 2026-05-28: Initial commit, Vite-mal byttet ut med ekte side (spørsmål + hjerte-konfetti på Ja).
- 2026-05-28: Lydeffekter (Web Audio) og neon/aurora-design.
- 2026-05-28: Relative asset-stier (`base ./`) så siden virker på både Vercel og GitHub Pages.
- 2026-05-29: Editorial redesign (serif, aura/korn, vibrasjon på mobil).
- 2026-05-29: Nei-knapp: alltid synlig (visualViewport-klamping, hard klamping, dodge i stedet for teleport, render i portal på body).
- 2026-05-29: Spørsmål endret til «blir det noe sengehygge i kveld?».
- 2026-05-29: Fjernet hint «lyd på · prøv å trykke Nei», viser kun teller ved dodge.
- 2026-09-03: Repo klonet fra GitHub til `WEBapplikasjoner/ja-eller-nei`, `npm install` kjørt, bygg verifisert OK, `.memory/` opprettet.
- 2026-09-03: Slettet duplikatmappen `../5555` (identisk klone av samme repo).
- 2026-09-03: `npm audit fix` – 5 high-sårbarheter (brace-expansion, browserslist, nanoid, postcss, vite) → 0. Bygg OK.
- 2026-09-03: Fikset 4 lint-feil (react-hooks/purity): HeartFall regnet ut Math.random under render; flyttet til lazy useState så hjertene ikke hopper ved re-render.
- 2026-09-05: Redesign «foredlet mørk romantikk» + feature-drevet omstrukturering
  (`features/atmosphere|ask|celebrate`, `shared/`). Motion-tokens delt med DOclaudepulse.
  Fikset: Nei-knappen animerte `left`/`top` og hadde ingen animasjon på første hopp
  (ble gjenskapt som ny node i portalen) → én stabil node + `transform`; evig
  `box-shadow`-glow på Ja-knappen fjernet; hard kutt til ja-skjermen erstattet med
  `asking → parting → celebrating`; `drop-shadow` per hjerte fjernet, 3 dybdelag,
  antall skalert etter skjerm. A11y: pinch-zoom tilbake, `:focus-visible`, hover gated
  for touch, `prefers-reduced-motion` dempes i stedet for å nulles. `package.json`
  omdøpt fra `5555` til `ja-eller-nei`.

