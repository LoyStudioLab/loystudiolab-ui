#!/usr/bin/env node
// @lsl/doctor · managed by loystudiolab-ui · change upstream, not here.
/*
  lsl-doctor: checks an app against the LoyStudioLab rules and reports by rule ID.
  No dependencies. Run from the app root:
    node scripts/lsl-doctor.mjs            # scans ./src, ./index.html, tailwind config
    node scripts/lsl-doctor.mjs src --json # machine-readable, for agents
    node scripts/lsl-doctor.mjs --manifest ../loystudiolab-ui/docs/public/manifest.json
  Exit code 1 when any error is found; warnings alone exit 0.
  Rule texts: https://loystudiolab.github.io/loystudiolab-ui/manifest.json (rules)
*/
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs"
import { createHash } from "node:crypto"
import { join, relative, resolve, extname } from "node:path"

const args = process.argv.slice(2)
const json = args.includes("--json")
const mIdx = args.indexOf("--manifest")
const manifestArg = mIdx >= 0 ? args[mIdx + 1] : null
const dirs = args.filter((a, i) => !a.startsWith("--") && i !== mIdx + 1)
const cwd = process.cwd()
const scanRoots = (dirs.length ? dirs : ["src"]).map((d) => resolve(cwd, d))
const DEFAULT_MANIFEST = "https://loystudiolab.github.io/loystudiolab-ui/manifest.json"

const findings = []
const add = (rule, severity, file, line, message) => findings.push({ rule, severity, file: relative(cwd, file), line, message })

function walk(dir, out = []) {
  if (!existsSync(dir)) return out
  for (const name of readdirSync(dir)) {
    if (name === "node_modules" || name === "dist" || name.startsWith(".")) continue
    const p = join(dir, name)
    const st = statSync(p)
    if (st.isDirectory()) walk(p, out)
    else if ([".js", ".jsx", ".ts", ".tsx", ".css", ".mjs"].includes(extname(p))) out.push(p)
  }
  return out
}

const HYPE = /\b(best-in-class|world[- ]class|cutting[- ]edge|state[- ]of[- ]the[- ]art|revolutionary|revolutioni[sz]e|game[- ]chang(?:er|ing)|seamless(?:ly)?|unparalleled|next[- ]generation|disruptive|synerg(?:y|ies)|industry[- ]leading|market[- ]leading|the best|best ever|unrivall?ed|groundbreaking|supercharge)\b/i
const STOCK_COLOR = /\b(?:bg|text|border|ring|fill|stroke|from|to|via|outline|decoration|divide|placeholder)-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose|white|black)(?:-\d{2,3})?\b/
const ARBITRARY_COLOR = /\b(?:bg|text|border|ring|fill|stroke|from|to|outline|decoration)-\[(?:#|rgb|hsl)/
const RADIUS = /\brounded(?:-(?:sm|md|lg|xl|2xl|3xl|full|[tblr]{1,2}(?:-(?:sm|md|lg|xl|2xl|3xl|full))?))?(?![\w-])/
const SHADOW = /\b(?:drop-)?shadow(?:-(?:sm|md|lg|xl|2xl|inner))?(?![\w-])/
const BAD_ICONS = /\b(CircleCheck(?:Big)?|CheckCircle2?|AlertTriangle|TriangleAlert|AlertCircle|CircleAlert|Info|XCircle|CircleX|Loader2|LoaderCircle|Loader|CircleDot|Circle|Triangle)\b/

const files = scanRoots.flatMap((r) => (statSync(r, { throwIfNoEntry: false })?.isFile() ? [r] : walk(r)))
const managed = []

for (const file of files) {
  const code = readFileSync(file, "utf8")
  const header = code.match(/^\/\/ @lsl\/([a-z0-9-]+)(?: ([0-9][0-9.]*))? ·/m) ?? code.match(/@lsl\/(foundation) ([0-9.]+) ·/)
  if (header) {
    managed.push({ file, name: header[1], version: header[2] ?? null, code })
    continue // managed files are checked for drift, not style
  }
  const ext = extname(file)
  const lines = code.split("\n")
  const isPage = /[\\/]pages[\\/]/.test(file)
  let accentCount = 0
  let lastHeading = 0
  let h1Count = 0
  let inBlockComment = false

  lines.forEach((raw, i) => {
    const n = i + 1
    let line = raw
    if (inBlockComment) {
      if (line.includes("*/")) inBlockComment = false
      return
    }
    if (/^\s*\/\*/.test(line) && !line.includes("*/")) {
      inBlockComment = true
      return
    }
    if (/^\s*(\/\/|\*)/.test(line)) return

    if (ext === ".css") {
      if (/@import\s+url\([^)]*fonts\.googleapis/.test(line)) add("T3", "error", file, n, "Fonts loaded with CSS @import. Use <link> in index.html.")
      if (/border-radius:\s*(?!0\b|0px|0;)/.test(line)) add("G1", "error", file, n, "border-radius must be 0.")
      if (/box-shadow:/.test(line) && !/none/.test(line)) add("G3", "error", file, n, "No shadows.")
      if (/(linear|radial|conic)-gradient\(/.test(line)) add("G4", "error", file, n, "No gradients.")
      if (/font-family:/.test(line) && !/(Jost|Archivo|var\(|inherit|monospace)/.test(line)) add("T1", "error", file, n, "Only Jost and Archivo.")
      return
    }

    if (/from\s+["']framer-motion["']/.test(line)) add("M2", "error", file, n, "framer-motion is not used. Use Reveal/Rise and CSS transitions.")
    const iconImport = line.match(/import\s*\{([^}]*)\}\s*from\s*["']lucide-react["']/)
    if (iconImport) {
      for (const name of iconImport[1].split(",").map((s) => s.trim().split(/\s+as\s+/)[0])) {
        if (BAD_ICONS.test(name) && new RegExp(`^${BAD_ICONS.source}$`).test(name)) add(name.startsWith("Loader") ? "S2" : "S3", "error", file, n, `lucide ${name}: circles and triangles carry brand meaning. Use StatusIcon or LinearLoader.`)
      }
    }
    if (/\banimate-spin\b/.test(line)) add("S2", "error", file, n, "Ring spinners are not used. Use LinearLoader or Skeleton.")
    const r = line.match(RADIUS)
    if (r && /class|cn\(|cva\(|["'`]/.test(line)) add(r[0] === "rounded-full" ? "S2" : "G1", "error", file, n, `"${r[0]}": radius is 0 everywhere${r[0] === "rounded-full" ? "; circles mean Loy only" : ""}.`)
    const s = line.match(SHADOW)
    if (s && /class|cn\(|cva\(|["'`]/.test(line) && !/shadow-none/.test(s[0])) add("G3", "error", file, n, `"${s[0]}": no shadows.`)
    if (/\bbg-gradient-to-|(linear|radial|conic)-gradient\(/.test(line)) add("G4", "error", file, n, "No gradients.")
    const stock = line.match(STOCK_COLOR)
    if (stock) add("C6", "error", file, n, `"${stock[0]}" is a stock Tailwind color. Use tokens (fg, fg-2, line, surface, ink, paper…).`)
    if (ARBITRARY_COLOR.test(line)) add("C6", "error", file, n, "Arbitrary color value. Use tokens.")
    if (/#[0-9a-fA-F]{6}\b|#[0-9a-fA-F]{3}\b(?![\w-])/.test(line) && /(fill|stroke|color|background|style|class|=)/.test(line) && !/href=|to=|id=|#[a-z-]+["']/.test(line)) add("C6", "warning", file, n, "Raw hex color. Use rgb(var(--lsl-…)) or token classes.")
    if (/\bbg-butter\b/.test(line)) add("C2", "error", file, n, "Butter is never a surface. Use Button variant=\"accent\" for the one CTA.")
    if (/\b(bg|text|border|fill|stroke)-signal\b/.test(line)) add("C4", "warning", file, n, "Signal is only for AI or computing states. Confirm this is one.")
    if (/variant=["']accent["']/.test(line)) accentCount++
    if (/—|&mdash;/.test(line)) add("W2", "error", file, n, "Em dash in copy. Use a period, comma or colon.")
    const hype = line.match(HYPE)
    if (hype && !/^\s*import/.test(line)) add("W3", "warning", file, n, `"${hype[0]}": no superlatives or hype.`)
    if (/<img\b(?![^>]*\balt=)/.test(line)) add("A8", "error", file, n, "<img> without alt. Use alt=\"\" only when decorative.")
    if (/\bfont-serif\b/.test(line)) add("T1", "warning", file, n, "Only Jost and Archivo (plus the mono token for code).")

    if (ext === ".jsx" || ext === ".tsx") {
      const hs = [...line.matchAll(/<h([1-6])\b|<Heading[^>]*\blevel=\{(\d)\}|<Display\b/g)]
      for (const m of hs) {
        const level = m[1] ? Number(m[1]) : m[2] ? Number(m[2]) : 1
        if (level === 1) h1Count++
        if (lastHeading && level > lastHeading + 1) add("T2", "warning", file, n, `Heading jumps from h${lastHeading} to h${level}. Keep levels sequential; use size for looks.`)
        lastHeading = level
      }
    }
  })
  if (isPage && accentCount > 1) add("C1", "error", file, 0, `${accentCount} accent CTAs in one page. Keep one.`)
  if (isPage && h1Count > 1) add("T2", "warning", file, 0, `${h1Count} h1 elements in one page. Use one.`)
}

// Setup checks
const indexHtml = resolve(cwd, "index.html")
if (existsSync(indexHtml)) {
  const html = readFileSync(indexHtml, "utf8")
  if (!/fonts\.googleapis\.com\/css2\?[^"']*Jost[^"']*|fonts\.googleapis\.com\/css2\?[^"']*Archivo/.test(html)) add("T3", "error", indexHtml, 0, "Jost and Archivo <link> missing from index.html <head>.")
  if (!/<html[^>]*lang=/.test(html)) add("A6", "error", indexHtml, 0, "<html> needs a lang attribute.")
}
const twConfig = ["tailwind.config.cjs", "tailwind.config.js"].map((f) => resolve(cwd, f)).find(existsSync)
if (twConfig && !/lsl-preset/.test(readFileSync(twConfig, "utf8"))) add("G1", "error", twConfig, 0, "tailwind config does not use the LoyStudioLab preset (src/styles/lsl-preset.cjs).")

// Drift: compare managed files against the manifest
async function loadManifest() {
  const src = manifestArg ?? DEFAULT_MANIFEST
  try {
    if (/^https?:/.test(src)) {
      const res = await fetch(src)
      if (!res.ok) throw new Error(String(res.status))
      return await res.json()
    }
    return JSON.parse(readFileSync(resolve(cwd, src), "utf8"))
  } catch (e) {
    return { error: `${src}: ${e.message}` }
  }
}
const bodyHash = (content) =>
  createHash("sha256")
    .update(content.replace(/^\/\/ @lsl\/[^\n]*\n/m, "").replace(/@lsl\/foundation [0-9.]+ ·/, "@lsl/foundation ·"))
    .digest("hex")
    .slice(0, 16)
const newer = (a, b) => {
  const pa = (a ?? "0").split(".").map(Number)
  const pb = (b ?? "0").split(".").map(Number)
  for (let i = 0; i < 3; i++) if ((pa[i] ?? 0) !== (pb[i] ?? 0)) return (pa[i] ?? 0) > (pb[i] ?? 0)
  return false
}

const manifest = managed.length ? await loadManifest() : null
let driftNote = null
if (manifest?.error) driftNote = `Drift check skipped (manifest not reachable: ${manifest.error}).`
else if (manifest) {
  for (const m of managed) {
    const item = manifest.items.find((it) => it.name === m.name)
    if (!item) continue
    const rel = relative(cwd, m.file).replace(/\\/g, "/")
    const f = item.files.find((x) => rel.endsWith(x.target.replace(/^src\//, "")) || rel === x.target) ?? item.files[0]
    if (m.version && newer(manifest.version, m.version)) add("DRIFT", "warning", m.file, 0, `@lsl/${m.name} ${m.version} is behind ${manifest.version}. Update: npx shadcn@latest add @lsl/${m.name} --overwrite`)
    else if (m.version && f?.hash && bodyHash(m.code) !== f.hash) add("DRIFT", "warning", m.file, 0, `Managed file @lsl/${m.name} was edited locally. Move the change upstream (a proposal) or into src/components/app/.`)
  }
}

const errors = findings.filter((f) => f.severity === "error")
const warnings = findings.filter((f) => f.severity === "warning")
if (json) {
  console.log(JSON.stringify({ ok: errors.length === 0, errors: errors.length, warnings: warnings.length, managedFiles: managed.length, driftNote, findings }, null, 2))
} else {
  const byRule = {}
  for (const f of findings) (byRule[f.rule] ??= []).push(f)
  for (const [rule, list] of Object.entries(byRule).sort()) {
    console.log(`\n${rule}  (${list.length})`)
    for (const f of list) console.log(`  ${f.severity === "error" ? "✗" : "!"} ${f.file}${f.line ? `:${f.line}` : ""}  ${f.message}`)
  }
  console.log(`\nlsl-doctor: ${errors.length} error(s), ${warnings.length} warning(s), ${files.length} files scanned, ${managed.length} managed.`)
  if (driftNote) console.log(driftNote)
  if (!findings.length) console.log("All clear.")
}
process.exit(errors.length ? 1 : 0)
