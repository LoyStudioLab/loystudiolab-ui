// Smoke test: install EVERY registry item into a copy of the Base44 template fixture with
// the real shadcn CLI, apply the foundation setup steps, build with Vite, run lsl-doctor.
//   npm run build:manifest && npm run build:registry && npm run smoke
import { execSync, spawn } from "node:child_process"
import { cpSync, rmSync, readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs"
import { resolve } from "node:path"
import { root, loadItems } from "./lib/registry.mjs"

const SHADCN = process.env.LSL_SHADCN ?? "shadcn@4.23.0"
const fixture = resolve(root, "fixtures/base44-app")
const work = resolve(root, "fixtures/.work")
const run = (cmd, opts = {}) => execSync(cmd, { cwd: work, stdio: "pipe", encoding: "utf8", ...opts })

// The registry server runs in its own process: execSync below blocks this one.
const port = 4800 + Math.floor(Math.random() * 100)
const server = spawn(process.execPath, [resolve(root, "scripts/serve-static.mjs"), String(port)], { stdio: "ignore" })
await new Promise((r) => setTimeout(r, 600))
const step = (s) => console.log(`\n▸ ${s}`)
let failed = false
try {
  step("Copy fixture")
  rmSync(work, { recursive: true, force: true })
  cpSync(fixture, work, { recursive: true })
  const cj = JSON.parse(readFileSync(resolve(work, "components.json"), "utf8"))
  cj.registries = { "@lsl": `http://127.0.0.1:${port}/r/{name}.json` }
  writeFileSync(resolve(work, "components.json"), JSON.stringify(cj, null, 2))

  const { items } = await loadItems()

  // Dependency cache: install the fixture's deps plus every registry dependency once,
  // then clone node_modules into each run (APFS clone on macOS), so shadcn's own
  // `npm install <deps>` only has to confirm what is already there.
  const cache = resolve(root, "fixtures/.cache")
  const allDeps = [...new Set(items.flatMap((i) => i.dependencies ?? []))]
  const cachePkg = JSON.parse(readFileSync(resolve(fixture, "package.json"), "utf8"))
  for (const d of allDeps) cachePkg.dependencies[d] ??= "*"
  const cacheKey = JSON.stringify(cachePkg)
  const keyFile = resolve(cache, ".key")
  if (!existsSync(keyFile) || readFileSync(keyFile, "utf8") !== cacheKey) {
    step("Build dependency cache (first run only)")
    rmSync(cache, { recursive: true, force: true })
    mkdirSync(cache, { recursive: true })
    writeFileSync(resolve(cache, "package.json"), JSON.stringify(cachePkg, null, 2))
    execSync("npm install --no-audit --no-fund --loglevel=error", { cwd: cache, stdio: "inherit", timeout: 900000 })
    writeFileSync(keyFile, cacheKey)
  }
  execSync(`cp -R${process.platform === "darwin" ? "c" : ""} "${resolve(cache, "node_modules")}" "${resolve(work, "node_modules")}"`)
  cpSync(resolve(cache, "package-lock.json"), resolve(work, "package-lock.json"))

  step(`Install ${items.length} items with ${SHADCN}`)
  const out = run(`npx -y ${SHADCN} add ${items.map((i) => `@lsl/${i.name}`).join(" ")} --yes --overwrite`, { timeout: 600000 })
  console.log(out.split("\n").filter((l) => /Created|Updated|Skipped|error|✖/i.test(l)).join("\n"))
  for (const it of items) for (const f of it.files) {
    const target = resolve(work, f.target.replace(/^~\//, ""))
    if (!existsSync(target)) throw new Error(`Not installed: ${f.target} (@lsl/${it.name})`)
  }
  console.log("All files present.")

  step("Apply foundation setup (fonts link, clean index.css)")
  const { fontLink } = await import(resolve(work, "src/lib/lsl-tokens.js"))
  let html = readFileSync(resolve(work, "index.html"), "utf8")
  html = html.replace(
    "</head>",
    `  <link rel="preconnect" href="https://fonts.googleapis.com" />\n    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />\n    <link href="${fontLink}" rel="stylesheet" />\n  </head>`
  )
  writeFileSync(resolve(work, "index.html"), html)
  writeFileSync(resolve(work, "src/index.css"), "@tailwind base;\n@tailwind components;\n@tailwind utilities;\n")
  cpSync(resolve(root, "fixtures/smoke-page.jsx"), resolve(work, "src/App.jsx"))

  step("Vite build")
  console.log(run("npx vite build --logLevel warn", { timeout: 300000 }) || "ok")
  const css = run("cat dist/assets/*.css")
  for (const needle of ["--lsl-paper", ".surface-ink", ".container-site", "border-radius:0!important"]) {
    if (!css.replace(/\s/g, "").includes(needle.replace(/\s/g, ""))) throw new Error(`Built CSS is missing ${needle}`)
  }
  console.log("Built CSS contains tokens, surfaces and base rules.")

  step("lsl-doctor")
  try {
    console.log(run(`node scripts/lsl-doctor.mjs src --manifest ${resolve(root, "docs/public/manifest.json")}`))
  } catch (e) {
    console.log(e.stdout)
    throw new Error("lsl-doctor reported errors in the smoke app")
  }
  console.log("\nSMOKE OK")
} catch (e) {
  failed = true
  console.error(`\nSMOKE FAILED: ${e.message}`)
  if (e.stdout) console.error(e.stdout)
  if (e.stderr) console.error(e.stderr)
} finally {
  server.kill()
}
process.exit(failed ? 1 : 0)
