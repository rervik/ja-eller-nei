# Ja eller Nei – status

## Om appen
Liten React 19 + Vite-side med ett spørsmål til Merethe. «Ja» gir hjerte-konfetti og lyd
(Web Audio), «Nei»-knappen smetter unna fingeren/musepekeren og kan ikke trykkes.

Struktur (feature-drevet): `src/features/atmosphere` (bakgrunnslys), `src/features/ask`
(spørsmål + Nei-knappens unnvikelse), `src/features/celebrate` (svar, hjerteregn, lysring),
`src/shared` (lyd, redusert bevegelse, typografi). Design- og motion-tokens i `src/index.css`.

Nei-knappen ligger alltid i en portal på `<body>`, forankret til en usynlig plassholder i
`.actions`, og flyttes kun med `transform` — derfor animerer også første hopp, og ingen
hopp utløser layout.

- Repo: https://github.com/rervik/ja-eller-nei (branch `main`)
- Live (Vercel): https://ja-eller-nei.vercel.app/
- Live (GitHub Pages via Actions, `.github/workflows/deploy.yml`): https://rervik.github.io/ja-eller-nei/
- Assets bruker relative stier (`base: './'`) så samme bygg virker begge steder.
- Kjør: `npm run dev` · Bygg: `npm run build` · Lint: `npm run lint`

## Pågår
- Ingenting pågår.

## Utestående / planlagt
- **Visuell kontroll gjenstår.** Bygg og lint er verifisert, men selve utseendet og
  følelsen er ikke sett i nettleser. Sjekk 375 / 768 / 1280 px, at Nei-knappens
  *første* hopp animerer, og `prefers-reduced-motion: reduce`.
- Ingenting fra 2026-09-03 eller 2026-09-05 er committet/pushet ennå.
