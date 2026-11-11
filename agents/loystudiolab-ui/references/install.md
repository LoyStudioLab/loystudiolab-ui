# Installing @lsl items: details

## Registry URL

- Public: `https://loystudiolab.github.io/loystudiolab-ui/r/{name}.json`
- Local (always works on Mariana's Mac): build with `npm run build:manifest && npm run build:registry`
  in the library folder, then `node scripts/serve-static.mjs 4873` and use
  `http://127.0.0.1:4873/r/{name}.json`.

`components.json` in the app:
```json
{
  "registries": { "@lsl": "<registry URL>" }
}
```

## What the CLI does

`npx shadcn@latest add @lsl/<name>` fetches the item JSON, resolves `registryDependencies`
(other `@lsl/...` items), writes every `files[].content` to `files[].target`, and runs the
package manager for `dependencies`. `--overwrite` replaces existing files without asking;
use it for `@lsl/foundation` (it replaces `tailwind.config.cjs`) and for updates.
`npx shadcn@latest add @lsl/<name> --diff` shows how an installed file differs from the
registry.

Tested with shadcn 4.23.0 against a copy of the Base44 Vite template (`npm run smoke` in
the library repo installs all items and builds).

## Targets

- `src/...` targets land at that path in the app.
- `~/...` targets land relative to the app root (`~/tailwind.config.cjs`, `~/scripts/lsl-doctor.mjs`).

## Foundation setup (once per app)

1. `npx shadcn@latest add @lsl/foundation @lsl/doctor @lsl/accent-budget --overwrite --yes`
2. `index.html` `<head>`:
   ```html
   <link rel="preconnect" href="https://fonts.googleapis.com" />
   <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
   <link href="https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;700&family=Jost:wght@500;600;700&display=swap" rel="stylesheet" />
   ```
   Remove any `@import url(...fonts.googleapis...)` from CSS. Set `<html lang="en">` and a real `<title>`.
3. `src/index.css`: only `@tailwind base; @tailwind components; @tailwind utilities;`
   (delete the stock shadcn `:root` and `.dark` blocks; the preset defines all variables).
4. Root component: render `<AccentBudget />` and `<Toaster />` once.
5. Layout route: `<SiteShell header={<SiteHeader … />} footer={<SiteFooter … />}><Outlet /></SiteShell>`.
6. Run `node scripts/lsl-doctor.mjs src`.

## No-CLI install (Base44 MCP)

For each item, depth-first through `registryDependencies`:
1. Read the JSON (`docs/public/r/<name>.json` locally, or fetch the URL).
2. For each file: `write_file(appId, path: target without "~/", content)`.
3. Merge `dependencies` into `package.json` (`^` latest compatible; Base44 already ships most).
4. Build-check with the node command from `base44-workflow` §6.

## Updating

`lsl-doctor` prints `DRIFT` for managed files that are behind the manifest version or were
edited locally. Update one item with `npx shadcn@latest add @lsl/<name> --overwrite`, then
re-run the doctor and the build. Read `CHANGELOG.md` in the library for migration notes.
