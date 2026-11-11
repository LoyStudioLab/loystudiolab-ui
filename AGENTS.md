# AGENTS.md: working inside the library

You are changing the library itself. (To *use* it in an app, load the `loystudiolab-ui`
skill instead.)

## Rules for library changes

- Values live only in `tokens/tokens.json`. Never hand-edit `src/styles/lsl-preset.cjs`,
  `src/lib/lsl-tokens.js` or `docs/public/*`: they are generated.
- `src/` mirrors where files land in an app. Imports use `@/` exactly as in an app.
- Every installable file starts with `// @lsl/<item> · managed by loystudiolab-ui · change upstream, not here.`
  The build stamps the version into it. lsl-doctor uses it to detect drift.
- Dependencies: only packages already in the Base44 Vite template `package.json`. Flag any
  exception in the item's metadata.
- Colors only through contextual tokens (`fg`, `fg-2`, `line`, `surface`, `danger`, `loy`,
  `signal-fg`, `tint`) unless the component is surface-independent by design.
- No circles or triangles outside the brand items (S1 to S3). No radius, shadow or gradient.
- New rules go in `registry/rules.js` with an ID; cite them from metadata and the doctor.
- New components need an approved proposal (`proposals/`).

## Definition of done for a component

1. Source in `src/`, header stamp, JSX, forwardRef where a DOM node is exposed.
2. Metadata in `registry/*.meta.js`: purpose, exports and props (validated against the
   source by `npm run build:manifest`), useWhen, dontUseWhen with alternatives, rules, a11y, example.
3. Examples in `docs/src/examples/index.jsx` covering every variant and state, on ink too
   when the component can sit on an ink band.
4. `npm test` (axe on every example), `npx playwright test` (browser axe incl. contrast,
   keyboard, no horizontal scroll at 375px, visual baselines) and `npm run smoke` all pass.
5. Visual baselines reviewed by Mariana.
6. `CHANGELOG.md` entry; `npm run sync:skill` if the skill or rules changed.
