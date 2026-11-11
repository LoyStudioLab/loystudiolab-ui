# Install test 2: a real Base44 app (paths B and C)

- Date: 2026-11-12 · Library 0.1.1 then 0.1.2 · Throwaway Base44 app `lsl-ui-fixture`
  (`6af4f8157643648c3e61433c`, Vite template, never published)

## Path B: shadcn CLI inside the Base44 sandbox (`run_command`)
- The sandbox reaches the public registry (HTTP 200). `npx shadcn@4.23.0 add @lsl/... --overwrite --yes`
  installed 16 files in about 40s, dependencies included.
- **Bug found:** the newer Base44 template ships `tailwind.config.js`. Tailwind reads that
  file first, so the foundation's `tailwind.config.cjs` was ignored and the build failed.
  Fixed in 0.1.2: the foundation writes `tailwind.config.js`; lsl-doctor names the config
  Tailwind actually reads and warns about a second one.
- **Gotcha:** the `node -e "...build()"` check from base44-workflow §6 fails in this
  template ("type": "module") with a misleading `border-border` error even on untouched
  code. `timeout 200 npx vite build --logLevel warn` works (about 10s).

## Path C: no CLI, `write_file` over MCP
- `@lsl/badge` and `@lsl/feedback` written from the public registry JSON's `files[].content`
  to `files[].target`. Built and rendered fine together with the CLI-installed items.

## Adopting in an existing app
- lsl-doctor found 198 findings, all in template code nobody had touched (stock shadcn
  files, auth pages, the ring spinner). The page built from the library had none.
  Added `--write-baseline` (0.1.2): after baselining, the doctor reports only new findings.
- Drift check on a real app: after the 0.1.2 release it flagged the 18 files still at
  0.1.1; `add ... --overwrite` updated them and the doctor came back clean.

## Final state
lsl-doctor: 0 errors, 0 warnings (198 baselined template findings). `npx vite build`: OK,
CSS contains the LoyStudioLab tokens and surfaces.
