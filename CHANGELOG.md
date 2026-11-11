# Changelog

All notable changes to loystudiolab-ui. Versions follow SemVer; `0.x` until 1.0.
Breaking changes get a **Migration** note.

## 0.1.2 · 2026-11-12

Tested on a real Base44 app (shadcn CLI in the sandbox, and file writes over MCP).

- **Migration:** @lsl/foundation now writes `tailwind.config.js` (was `.cjs`). Newer Base44
  templates ship `tailwind.config.js`, which Tailwind reads first, so the `.cjs` preset was
  silently ignored there. Re-run `npx shadcn@latest add @lsl/foundation --overwrite` and
  delete `tailwind.config.cjs`.
- lsl-doctor: reports which Tailwind config is actually read and warns about a second one;
  new `--write-baseline` mode and `lsl-doctor.baseline.json`, so template code you did not
  write does not hide new findings.
- Skill: sandbox build command (`npx vite build`), baseline step, template spinner swap.

## 0.1.1 · 2026-11-12

- MetaList: long terms and values wrap instead of overflowing narrow screens (found by CI at 375px on Linux).
- Grid: `align` prop. Skill: About recipe, router note, accent placement, local manifest flag for lsl-doctor.

## 0.1.0 · 2026-11-11

Phase 1: foundation, harvest and the agent loop.

- Tokens in `tokens/tokens.json` (DTCG), generated into a Tailwind preset, JS tokens and
  `tokens.css`. New AA-safe tones: `brick-deep`, `brick-light`, `petrol-light`, `signal-ink`.
- Surfaces (`surface-paper | alt | ink`) replace per-component `onInk` props.
- 15 restyled shadcn primitives (button, input, textarea, label, select, checkbox,
  radio-group, switch, badge, card, sheet, separator, sonner, skeleton, tooltip).
- LSL components harvested from the alt site and the redesign: Mark, Logo, Glyph,
  LayerTag, LayerLegend, FounderMonogram, layout set, typography set, IconButton, Field,
  RadioTiles, SiteHeader, SiteFooter, SiteShell, Breadcrumbs, data display set,
  StatusIcon, feedback set, Reveal/Rise, AccentBudget, hooks and formatters.
- 35 rules with IDs; manifest, intent index, llms.txt; lsl-doctor; loystudiolab-ui skill.
- Docs site, unit + axe tests, Playwright axe/keyboard/visual tests, install smoke test
  against a Base44 template fixture.

Decisions recorded from the plan: Loy tag is petrol (C3); concrete is never text (C5);
focus is the dual butter + ink ring, not a butter border (A2); the overlap mark is interim
until the final logo arrives.
