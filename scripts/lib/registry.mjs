// Shared loader for registry metadata and source files.
import { readFileSync, existsSync } from "node:fs"
import { createHash } from "node:crypto"
import { resolve, dirname } from "node:path"
import { fileURLToPath, pathToFileURL } from "node:url"
import { parse } from "@babel/parser"

export const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..")
export const src = resolve(root, "src")
export const pkg = JSON.parse(readFileSync(resolve(root, "package.json"), "utf8"))
export const VERSION = pkg.version
export const SITE = process.env.LSL_SITE ?? "https://loystudiolab.github.io/loystudiolab-ui"
export const REGISTRY_URL = `${SITE}/r/{name}.json`

export async function loadItems() {
  const files = ["foundation.meta.js", "ui.meta.js", "lsl.meta.js"]
  const items = []
  for (const f of files) {
    const mod = await import(pathToFileURL(resolve(root, "registry", f)).href)
    items.push(...mod.default)
  }
  const { RULES } = await import(pathToFileURL(resolve(root, "registry/rules.js")).href)
  const { INTENTS } = await import(pathToFileURL(resolve(root, "registry/intents.js")).href)
  return { items, RULES, INTENTS }
}

export const absPath = (p) => resolve(src, p)

// Header stamp: "// @lsl/name ·" or "// @lsl/name 0.1.0 ·" -> "// @lsl/name <VERSION> ·"
export function stamp(content) {
  return content.replace(/^(\/\/ @lsl\/[a-z0-9-]+)(?: [0-9][0-9.]*)? ·/m, `$1 ${VERSION} ·`)
}

// Hash of a file body without its stamp line, so version bumps alone do not count as drift.
export function bodyHash(content) {
  const body = content.replace(/^\/\/ @lsl\/[^\n]*\n/m, "").replace(/@lsl\/foundation [0-9.]+ ·/, "@lsl/foundation ·")
  return createHash("sha256").update(body).digest("hex").slice(0, 16)
}

export function readSource(p) {
  const abs = absPath(p)
  if (!existsSync(abs)) throw new Error(`Missing file ${p}`)
  return readFileSync(abs, "utf8")
}

// Destructured prop names of a component, by export name. null if not found.
export function destructuredProps(code, name) {
  let ast
  try {
    ast = parse(code, { sourceType: "module", plugins: ["jsx"] })
  } catch {
    return null
  }
  const fromFn = (fn) => {
    const first = fn?.params?.[0]
    if (!first) return []
    if (first.type === "ObjectPattern") return first.properties.filter((pr) => pr.type === "ObjectProperty").map((pr) => pr.key.name ?? pr.key.value)
    return []
  }
  const fromInit = (init) => {
    if (!init) return null
    if (init.type === "MemberExpression") return "ALIAS" // e.g. const Select = SelectPrimitive.Root
    if (init.type === "ArrowFunctionExpression" || init.type === "FunctionExpression") return fromFn(init)
    if (init.type === "CallExpression") {
      const fn = init.arguments.find((a) => a.type === "ArrowFunctionExpression" || a.type === "FunctionExpression")
      return fn ? fromFn(fn) : null
    }
    return null
  }
  for (const stmt of ast.program.body) {
    const decl = stmt.type === "ExportNamedDeclaration" ? stmt.declaration : stmt
    if (!decl) continue
    if (decl.type === "FunctionDeclaration" && decl.id?.name === name) return fromFn(decl)
    if (decl.type === "VariableDeclaration") {
      for (const d of decl.declarations) if (d.id?.name === name) return fromInit(d.init)
    }
  }
  return null
}
