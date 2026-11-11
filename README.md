# loystudiolab-ui

The LoyStudioLab component library: tokens, components and rules for the studio's own
websites and Lab products (Snapticket, Kine OS). React + Tailwind 3.4 + shadcn/ui in JSX,
distributed as a shadcn-compatible registry, so the source lands inside each app where
people and agents can read it. LoyStudioLab brand only; client projects keep their own UI.

- Docs and registry: https://loystudiolab.github.io/loystudiolab-ui/
- For agents: `agents/loystudiolab-ui/SKILL.md` (synced to the workspace skills folder),
  `docs/public/manifest.index.json`, `docs/public/llms.txt`
- Theory: `AESTHETIC_PHILOSOPHY.md` in the studio website folder

## Use it in an app

```json
// components.json
"registries": { "@lsl": "https://loystudiolab.github.io/loystudiolab-ui/r/{name}.json" }
```
```bash
npx shadcn@latest add @lsl/foundation @lsl/doctor @lsl/accent-budget --overwrite
npx shadcn@latest add @lsl/site-shell @lsl/site-header @lsl/site-footer @lsl/layout @lsl/typography @lsl/button
node scripts/lsl-doctor.mjs src
```
Then follow the foundation setup (fonts `<link>`, plain `index.css`): see the Foundation page in the docs.

## Work on the library

```bash
npm install
npm run dev               # docs site on :5199 (built with the library)
npm run build:tokens      # tokens/tokens.json -> preset, JS tokens, tokens.css
npm run check:contrast    # fails if an allowed text/UI pair drops below WCAG AA
npm run build:manifest    # validates meta against source; writes manifest, llms.txt, registry.json
npm run build:registry    # docs/public/r/<name>.json with inlined, version-stamped files
npm test                  # Vitest: behaviour + axe on every example
npx playwright test       # browser axe, keyboard, no-overflow at 375px, visual (@visual)
npm run smoke             # installs every item into a Base44 template copy with the shadcn CLI, builds, runs lsl-doctor
npm run sync:skill        # copies the agent skill to the workspace skills folder
```

## Layout

```
tokens/            tokens.json (the only place values live), base-styles.cjs
src/               installable source, laid out exactly as it lands in an app
  styles/lsl-preset.cjs     generated Tailwind preset
  components/ui/            shadcn primitives, restyled (L1)
  components/lsl/<cat>/     LoyStudioLab components (L2, L3)
  hooks/, lib/              hooks and helpers (L0)
registry/          metadata per item (purpose, props, do/don't, rules, a11y, example), rules.js, intents.js
scripts/           build scripts, lsl-doctor, smoke test, static server
docs/              docs site (Vite); docs/public holds the generated manifest and registry
fixtures/          a trimmed Base44 Vite template for install tests
tests/             unit (Vitest + axe) and visual (Playwright)
agents/            the loystudiolab-ui skill (source)
proposals/         new-component proposals (TEMPLATE.md)
```

## Adding or changing a component

See `AGENTS.md`. Every change needs: source in `src/`, metadata in `registry/*.meta.js`,
examples in `docs/src/examples/index.jsx`, passing tests, updated visual baselines
reviewed by Mariana, and a `CHANGELOG.md` entry.

All rights reserved. LoyStudioLab.
