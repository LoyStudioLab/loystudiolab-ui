// Writes one shadcn registry-item JSON per item to docs/public/r/<name>.json, with file
// contents inlined and the version stamped into each managed file's header. Each JSON is
// self-contained, so an agent can install without the CLI (write files[].content to
// files[].target, add dependencies to package.json).
import { writeFileSync, mkdirSync } from "node:fs"
import { resolve } from "node:path"
import { loadItems, readSource, stamp, root, VERSION } from "./lib/registry.mjs"

const { items } = await loadItems()
const out = resolve(root, "docs/public/r")
mkdirSync(out, { recursive: true })

for (const it of items) {
  const json = {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: it.name,
    type: it.type,
    title: it.title,
    description: it.purpose,
    dependencies: it.dependencies ?? [],
    registryDependencies: it.registryDependencies ?? [],
    files: it.files.map((f) => ({ path: `src/${f.path}`.replace("src/../", ""), type: f.type, target: f.target, content: stamp(readSource(f.path)) })),
    meta: { version: VERSION, layer: it.layer, status: it.status, category: it.category, rules: it.rules },
    ...(it.setup ? { docs: it.setup.join("\n") } : {}),
  }
  writeFileSync(resolve(out, `${it.name}.json`), JSON.stringify(json, null, 2))
}
writeFileSync(
  resolve(out, "index.json"),
  JSON.stringify(items.map((it) => ({ name: it.name, type: it.type, title: it.title, version: VERSION })), null, 2)
)
console.log(`registry ${VERSION}: ${items.length} items written to docs/public/r/`)
