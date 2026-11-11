// Validates registry metadata against the source and writes the agent-facing outputs:
//   docs/public/manifest.json        full catalogue (items, exports, props, rules, examples, hashes)
//   docs/public/manifest.index.json  small: intents + one line per item (for choosing)
//   docs/public/llms.txt             short text index for agents
//   docs/public/llms-full.txt        everything as text
//   registry.json                    shadcn registry index
import { writeFileSync, mkdirSync } from "node:fs"
import { resolve } from "node:path"
import { loadItems, readSource, destructuredProps, bodyHash, root, VERSION, SITE, REGISTRY_URL } from "./lib/registry.mjs"

const { items, RULES, INTENTS } = await loadItems()
const ruleIds = new Set(RULES.map((r) => r.id))
const names = new Set(items.map((i) => i.name))
const IGNORE = new Set(["className", "children", "style", "ref"])
const errors = []

for (const it of items) {
  for (const k of ["name", "title", "category", "layer", "status", "purpose", "files", "exports", "useWhen", "rules", "example"]) {
    if (it[k] == null) errors.push(`${it.name}: missing "${k}"`)
  }
  for (const r of it.rules ?? []) if (!ruleIds.has(r)) errors.push(`${it.name}: unknown rule ${r}`)
  for (const d of it.registryDependencies ?? []) {
    const n = d.replace(/^@lsl\//, "")
    if (!names.has(n)) errors.push(`${it.name}: registryDependency ${d} does not exist`)
  }
  for (const f of it.files) {
    let code
    try {
      code = readSource(f.path)
    } catch (e) {
      errors.push(`${it.name}: ${e.message}`)
      continue
    }
    f.hash = bodyHash(code)
    if (!/\.(jsx?|tsx?)$/.test(f.path) || f.path.endsWith(".cjs") || f.path.includes("tokens")) continue
    for (const ex of it.exports) {
      if (ex.kind) continue // hooks, functions, constants: not validated as components
      const found = destructuredProps(code, ex.name)
      if (found === "ALIAS") continue
      if (found == null) {
        if (it.files.length === 1) errors.push(`${it.name}: export ${ex.name} not found in ${f.path}`)
        continue
      }
      const documented = new Set(ex.props.map((p) => p.name))
      for (const s of found) if (!IGNORE.has(s) && !documented.has(s)) errors.push(`${it.name}: ${ex.name} prop "${s}" is in the source but not documented`)
      for (const d of documented) if (!IGNORE.has(d) && !found.includes(d)) errors.push(`${it.name}: ${ex.name} prop "${d}" is documented but not in the source`)
    }
  }
}

if (errors.length) {
  console.error("Manifest validation failed:\n- " + errors.join("\n- "))
  process.exit(1)
}

const install = (n) => `npx shadcn@latest add @lsl/${n}`
const manifest = {
  $schema: `${SITE}/manifest.schema.json`,
  name: "loystudiolab-ui",
  version: VERSION,
  registry: REGISTRY_URL,
  generated: new Date().toISOString().slice(0, 10),
  layers: {
    L0: "Foundation: tokens, preset, hooks, lib",
    L1: "Primitives: shadcn/ui restyled, src/components/ui",
    L2: "LSL components: src/components/lsl/<category>",
    L3: "Patterns and sections",
    L4: "Page templates",
  },
  rules: RULES,
  intents: INTENTS,
  items: items.map((it) => ({ ...it, install: install(it.name), json: REGISTRY_URL.replace("{name}", it.name) })),
}

const index = {
  name: "loystudiolab-ui",
  version: VERSION,
  registry: REGISTRY_URL,
  manifest: `${SITE}/manifest.json`,
  howToUse: "1) Find your intent below. 2) Read that item in manifest.json (props, do/don't, example). 3) Install with the registry. 4) Run lsl-doctor.",
  intents: INTENTS,
  items: items.map((it) => ({ name: it.name, title: it.title, category: it.category, layer: it.layer, status: it.status, purpose: it.purpose, exports: it.exports.map((e) => e.name) })),
  rules: RULES.map((r) => `${r.id}: ${r.rule}`),
}

const out = resolve(root, "docs/public")
mkdirSync(out, { recursive: true })
writeFileSync(resolve(out, "manifest.json"), JSON.stringify(manifest, null, 2))
writeFileSync(resolve(out, "manifest.index.json"), JSON.stringify(index, null, 2))

const byCat = {}
for (const it of items) (byCat[it.category] ??= []).push(it)
const llms = `# LoyStudioLab UI ${VERSION}

> Component library for LoyStudioLab's own sites and Lab products (Snapticket, Kine OS). React + Tailwind 3.4 + shadcn/ui (JSX), distributed as a shadcn registry. Not for client brands.

Before building UI: read the intents and rules, pick a template, then sections, then components. Install from the registry, put copy in src/data/content.js, run lsl-doctor.

- Registry: ${REGISTRY_URL}  (components.json: "registries": { "@lsl": "${REGISTRY_URL}" })
- Manifest (full): ${SITE}/manifest.json
- Manifest (index): ${SITE}/manifest.index.json
- Full text: ${SITE}/llms-full.txt

## Intents
${INTENTS.map((i) => `- ${i.intent}: ${i.use.join(", ")}`).join("\n")}

## Rules
${RULES.map((r) => `- ${r.id} ${r.rule}`).join("\n")}

## Items
${Object.entries(byCat).map(([c, list]) => `### ${c}\n${list.map((it) => `- @lsl/${it.name} (${it.exports.map((e) => e.name).join(", ")}): ${it.purpose}`).join("\n")}`).join("\n\n")}
`
writeFileSync(resolve(out, "llms.txt"), llms)

const full = [llms, "\n## Item details\n"]
for (const it of items) {
  full.push(`### @lsl/${it.name} · ${it.title}
${it.purpose}
Layer ${it.layer} · ${it.status} · install: ${install(it.name)}
Files: ${it.files.map((f) => f.target).join(", ")}
${it.exports.map((e) => `- ${e.name}${e.props.length ? `\n${e.props.map((p) => `    - ${p.name}${p.required ? " (required)" : ""}: ${p.type}${p.default ? ` = ${p.default}` : ""}${p.description ? `. ${p.description}` : ""}`).join("\n")}` : ""}`).join("\n")}
Use when: ${it.useWhen.join(" ")}
${it.dontUseWhen?.length ? `Do not use when: ${it.dontUseWhen.map((d) => `${d.case} (use ${d.use})`).join("; ")}` : ""}
Rules: ${it.rules.join(", ")}
${it.a11y?.length ? `Accessibility: ${it.a11y.join(" ")}` : ""}
${it.setup ? `Setup:\n${it.setup.map((s) => `- ${s}`).join("\n")}` : ""}
Example:
\`\`\`jsx
${it.example}
\`\`\`
`)
}
writeFileSync(resolve(out, "llms-full.txt"), full.join("\n"))

const registry = {
  $schema: "https://ui.shadcn.com/schema/registry.json",
  name: "lsl",
  homepage: SITE,
  items: items.map((it) => ({
    name: it.name,
    type: it.type,
    title: it.title,
    description: it.purpose,
    dependencies: it.dependencies ?? [],
    registryDependencies: it.registryDependencies ?? [],
    files: it.files.map((f) => ({ path: `src/${f.path}`.replace("src/../", ""), type: f.type, target: f.target })),
  })),
}
writeFileSync(resolve(root, "registry.json"), JSON.stringify(registry, null, 2))
console.log(`manifest ${VERSION}: ${items.length} items, ${items.reduce((n, i) => n + i.exports.length, 0)} exports, ${RULES.length} rules, ${INTENTS.length} intents`)
