# Changelog

All notable changes to loystudiolab-ui. Versions follow SemVer; `0.x` until 1.0.
Breaking changes get a **Migration** note.

## 0.2.0 · 2026-11-16

The final LoyStudioLab logo replaces the interim mark.

- **Logo (@lsl/mark):** geometry traced from Mariana's master file (edges fitted to the
  pixels; the mark matches the 512px icon with no visible difference). Three separate,
  animatable shapes: `lsl-circle` (Loy), `lsl-triangle` (Lab, a cut that shows the
  surface: an equilateral triangle rotated 1.52deg), `lsl-square` (Studio, rotated
  16.46deg). Wordmark outlined: LOY STUDIO in Jost Black, LAB custom letterforms.
- New exports: `Lockup`, `LogoAssemble` (circle, then the Lab cut as a wipe, then the Studio
  square; reports each step and can highlight a LayerLegend; final state under reduced
  motion and before its observer runs), `LOCKUP_GEOMETRY`, `LOGO_COLORS`, `LOGO_MIN`.
  `Mark` and `Logo` take `tone="color" | "mono"`; size floors 16px (mark) and 40px (lockup).
- **Migration:** `Logo` now renders the lockup (mark + LOY / STUDIO / LAB). `variant`
  "horizontal" and "stacked" still work and render the lockup; use `variant="mark"` for the
  mark alone. `AssemblingMark` is deprecated: use `LogoAssemble`. Inside a link with its
  own `aria-label`, pass `title=""`. Update with
  `npx shadcn@latest add @lsl/foundation @lsl/glyph @lsl/mark --overwrite --yes`.
- Tokens: new `logo` group with the file's exact colors (circle #161512, cream #F3EFE5,
  yellow #F5B640, LAB #1B1A17), kept out of the Tailwind palette. Surfaces set
  `--lsl-logo-circle` and `--lsl-logo-lab`, so the logo reverses by itself on ink. The
  butter accent (#FFB400) is unchanged.
- Rules L1 to L5 (use as delivered, lockup vs mark, minimum size, clearspace, logo colors).
- LayerLegend: `order`, `active` and `onActiveChange` props.
- Brand files published with the docs at `/brand/` (SVG mark and lockup in color, reversed,
  mono, mono-reversed; favicon.svg/.ico, 16/32/180/192/512 PNGs, social avatar, OG image).
  Masters live in `studio/brand/logo/`.
- SiteHeader passes `title=""` to the logo (the home link carries the name).

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
