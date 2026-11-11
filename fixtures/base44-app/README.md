# Fixture: Base44 Vite template (trimmed)

A stand-in for a fresh Base44 app, used by `npm run smoke` to prove that every registry
item installs with the real shadcn CLI and builds. Mirrors the template's
`components.json` (new-york, JSX, aliases), `jsconfig.json`, stock shadcn
`tailwind.config.cjs` and `src/index.css`, and `src/lib/utils.js` (incl. `isIframe`).
The Base44 Vite plugin is replaced by a plain `@` alias so it builds offline.
Never edit by hand during a smoke run; the script copies it to `fixtures/.work/`.
