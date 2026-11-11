---
name: loystudiolab-ui
description: >
  Build any UI for the LoyStudioLab brand from the studio's own component library
  (loystudiolab-ui): the studio websites, Lab products (Snapticket, Kine OS), Lab
  prototypes and web pages in the LoyStudioLab look. Tells you how to find the right
  component (manifest + intent index), install it from the @lsl shadcn registry (local
  clone, Base44 sandbox or no-CLI), compose pages without re-deciding design, and verify
  with lsl-doctor. Use it before writing any JSX, CSS or copy for a LoyStudioLab-branded
  screen. Triggers: "LoyStudioLab site", "studio website", "build a page for
  LoyStudioLab", "Snapticket screen", "Kine OS UI", "use our component library",
  "@lsl", "loystudiolab-ui", "Bauhaus brand", "Warm Studio palette". Not for client
  brands (OSF HUB, Casa Clean, FlatKompis): they keep their own UI.
---

# LoyStudioLab UI: build from the library, never from memory

The library is the single source of design decisions for LoyStudioLab-branded work.
Your job is to **choose and compose**, not to design. If you notice yourself picking a
color, a radius, a font size or an icon style, stop: the library already decided it.

- Library repo (local): `LoyStudioLab/loystudiolab-ui/` today; after the OKF move it becomes `LoyStudioLab/studio/ui-library/`. Use whichever exists. Below, `<lib>` means that folder.
- Docs + registry (public): `https://loystudiolab.github.io/loystudiolab-ui/`
- Manifest index (read first): `<lib>/docs/public/manifest.index.json`, or `<docs>/manifest.index.json`
- Full manifest: `<lib>/docs/public/manifest.json` (props, variants, do/don't, a11y, examples, file hashes)
- Text versions: `<lib>/docs/public/llms.txt`, `<lib>/docs/public/llms-full.txt`
- Rules with rationale: `references/rules.md` (IDs like C1, S2, A5: the same IDs lsl-doctor prints)
- Page recipes: `references/recipes.md` · Install details: `references/install.md`
- The why behind it all: `AESTHETIC_PHILOSOPHY.md` in the studio website folder (`Website/` today, `studio/website/` after the OKF move)

## Non-negotiables (memorize these; the rest is in the manifest)

1. **One** `variant="accent"` (butter) button per page, on the page's main goal: in the hero when the page sells (home), in the closing band when the page informs first (about, case study). Butter is never a background. (C1, C2)
2. Circle = Loy, square = Studio, hollow triangle = Lab. **These shapes mean nothing else**:
   no round avatars (except FounderMonogram), no ring spinners, no pie charts, no lucide
   `CircleCheck` / `AlertTriangle` / `Info`. Use `StatusIcon`, `LinearLoader`, `Avatar`. (S1 to S3)
3. Radius 0, 2px borders, no shadows, no gradients. The preset enforces most of it; do not fight it. (G1 to G4)
4. Colors only from tokens. On ink bands use `<Section surface="ink">`; components adapt. No raw hex, no stock Tailwind colors. (C6)
5. Petrol only for the Loy layer. Signal teal only for AI or computing states. (C3, C4)
6. Jost + Archivo via the `<link>` in `index.html`. Heading levels sequential, size via the `size` prop. (T1 to T3)
7. Copy: English, plain, modest. **No em dashes.** No superlatives, no stats as flex, real assets only. Copy lives in `src/data/content.js`. (W1 to W6)
8. Accessible by default: every control in a `Field`, visible focus (never removed), keyboard works, reduced motion respected. (A1 to A8)

## Decision procedure (follow in order)

1. **Read `manifest.index.json`.** Find your intent in `intents`. Note the item names.
2. **Choose the highest layer that fits**: page template (L4, from phase 2) → sections and
   patterns (L3) → components (L2) → primitives (L1). Read each chosen item in
   `manifest.json`: `useWhen`, `dontUseWhen`, `props`, `rules`, `example`.
3. **Install from the registry** (see Install). Never hand-copy library code into a page.
4. **Compose.** Pages are a stack of `<Section surface>` bands inside `SiteShell`. Inside a
   section: `TitleBlock` / `Heading` / `Lead`, then `RuledGrid`, `Grid`, `Stack`, `Cluster`,
   `Card`. Use `Reveal` for scroll-in (inside cells, around their content), `Rise` for the
   hero. Nothing else moves. For in-page links, the `id` goes on the `Section` and its
   heading gets `tabIndex={-1}` plus `data-section-heading`.
5. **Write copy into `src/data/content.js`** and import it. Follow the writing rules.
6. **Missing piece?** Build an app-local composite in `src/components/app/` using only
   library parts and token classes. Do not edit files under `src/components/ui/`,
   `src/components/lsl/`, `src/styles/lsl-preset.cjs` or other files whose first line reads
   `// @lsl/... managed by loystudiolab-ui`. If the piece would be useful in two or more
   projects, also write a proposal (see "New components").
7. **Verify** (see Verify). Fix every reported rule ID before you call it done.
8. **Report** what you used: library items, app-local composites, any proposal, and the
   lsl-doctor result.

## Install

Pick the path that matches where the app lives (details and edge cases in `references/install.md`):

**A. Local clone of the app's repo (preferred).** Once per app, add the registry to
`components.json`:
```json
"registries": { "@lsl": "https://loystudiolab.github.io/loystudiolab-ui/r/{name}.json" }
```
New app or first install (writes `tailwind.config.js` with the preset; delete any old `tailwind.config.cjs`):
```bash
npx shadcn@latest add @lsl/foundation @lsl/doctor @lsl/accent-budget --overwrite --yes
```
Then follow the foundation setup: add the fonts `<link>` (value of `fontLink` in
`src/lib/lsl-tokens.js`) to `index.html`, reduce `src/index.css` to the three `@tailwind`
lines, mount `<AccentBudget />` and `<Toaster />` once near the router.
Then add what you need, e.g. `npx shadcn@latest add @lsl/site-shell @lsl/site-header @lsl/site-footer @lsl/layout @lsl/typography @lsl/button --yes`.
Registry dependencies install automatically. Install only what you use. The foundation
setup notes print after every `add`; do them once.

The app needs a router: SiteHeader, SiteFooter and Breadcrumbs use react-router. Base44
apps already have `<BrowserRouter>`; in a bare app add one with a layout route
(`<Route element={<SiteShell …><Outlet /></SiteShell>}>`) and a `path="*"` route.

If the public registry is not reachable yet, serve the local build:
`node <lib>/scripts/serve-static.mjs 4873` (after `npm run build:manifest && npm run build:registry` there) and use
`http://127.0.0.1:4873/r/{name}.json` as the registry URL.

**B. Base44 sandbox via MCP** (`base44-workflow` skill): run the same `npx shadcn ... --yes`
commands with `run_command` (tested: the sandbox reaches the public registry). Build-check
with `timeout 200 npx vite build --logLevel warn` (tested, about 10s). The `node -e
"...build()"` one-liner from base44-workflow §6 skips the Tailwind config in "type":
"module" apps and fails with a misleading `border-border` error.

**C. No CLI.** Read `r/<name>.json` (local `docs/public/r/` or the URL). For each entry in
`files`, write `content` to `target` (`~/` means the app root) with `write_file`. Repeat for
every `registryDependencies` item. Add `dependencies` to `package.json`. Then do the
foundation setup above.

**Adopting the library in an existing Base44 app:** its template code (stock shadcn
files you have not replaced, auth pages, the ring spinner in App.jsx) breaks many rules.
Replace the spinner with `LinearLoader`, then run
`node scripts/lsl-doctor.mjs src --write-baseline` once and commit
`lsl-doctor.baseline.json`. Later runs show only new findings. Never re-baseline to hide
findings in code you wrote.

## Verify

```bash
node scripts/lsl-doctor.mjs src          # rule IDs with file:line
node scripts/lsl-doctor.mjs src --json   # for you to parse
# until the public docs are live, point the drift check at the local manifest:
node scripts/lsl-doctor.mjs src --manifest <lib>/docs/public/manifest.json
```
Then build, then open the page (preview tools) at 375px and 1280px: check focus with Tab,
check there is no horizontal scroll, and run axe in the browser if you can (inject
axe-core from `<lib>/node_modules/axe-core/axe.min.js` and call `axe.run()`). `DRIFT` warnings mean a
managed file was edited or is behind the registry: move the change into
`src/components/app/` or update with `npx shadcn@latest add @lsl/<name> --overwrite`.

## New components

You may always build app-local composites (step 6). A **new library component** needs
Mariana's approval: write `<lib>/proposals/NNN-<name>.md` from
`proposals/TEMPLATE.md` (problem, why existing parts do not fit, proposed API, a11y, rules
touched, which projects need it) and ask her. Never add variants, colors or shape meanings
inside an app.

## Base44 notes

- Base44 apps are Vite + React + Tailwind 3.4 + shadcn new-york in JSX: the registry fits
  them as they are (tested on a fresh Base44 app, paths B and C, 2026-11-12). Newer
  templates use `tailwind.config.js`, older ones `tailwind.config.cjs`: the foundation
  writes `.js`, which Tailwind reads first; delete the `.cjs`. Their stock `src/components/ui/*` files get replaced by the LSL
  versions with the same names and APIs, so existing imports keep working.
- Writing files only changes the sandbox. Publishing is always Mariana's step in the
  Base44 editor. Say so in your report.
- Production apps: confirm with Mariana before writing (base44-workflow, "Production safety rule").
