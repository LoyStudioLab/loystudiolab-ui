import { describe, it, expect } from "vitest"
import { execFileSync } from "node:child_process"
import { resolve } from "node:path"

const root = resolve(__dirname, "../..")

function doctor(dir) {
  try {
    return JSON.parse(execFileSync("node", ["scripts/lsl-doctor.mjs", dir, "--json", "--manifest", "docs/public/manifest.json"], { cwd: root, encoding: "utf8" }))
  } catch (e) {
    return JSON.parse(e.stdout)
  }
}

describe("lsl-doctor", () => {
  it("reports every planted violation by rule ID", () => {
    const res = doctor("tests/doctor-fixture/src")
    const rules = new Set(res.findings.map((f) => f.rule))
    for (const id of ["M2", "S3", "S2", "G1", "G3", "G4", "C6", "W2", "W3", "T2", "C2", "A8", "C1"]) expect(rules, id).toContain(id)
    expect(res.ok).toBe(false)
  })
  it("passes the library source", () => {
    const res = doctor("src")
    expect(res.errors).toBe(0)
  })
})

describe("lsl-doctor baseline", () => {
  it("hides recorded findings and still reports new ones", async () => {
    const { mkdtempSync, cpSync, writeFileSync, rmSync } = await import("node:fs")
    const { tmpdir } = await import("node:os")
    const { join } = await import("node:path")
    const dir = mkdtempSync(join(tmpdir(), "lsl-doctor-"))
    cpSync(resolve(root, "tests/doctor-fixture/src"), join(dir, "src"), { recursive: true })
    const run = (...a) => {
      try {
        return execFileSync("node", [resolve(root, "scripts/lsl-doctor.mjs"), "src", ...a], { cwd: dir, encoding: "utf8" })
      } catch (e) {
        return e.stdout
      }
    }
    run("--write-baseline", "--manifest", resolve(root, "docs/public/manifest.json"))
    const clean = JSON.parse(run("--json", "--manifest", resolve(root, "docs/public/manifest.json")))
    expect(clean.errors).toBe(0)
    expect(clean.baselined).toBeGreaterThan(10)
    writeFileSync(join(dir, "src/pages/New.jsx"), 'export default () => <div className="rounded-lg" />\n')
    const after = JSON.parse(run("--json", "--manifest", resolve(root, "docs/public/manifest.json")))
    expect(after.findings.map((f) => f.rule)).toContain("G1")
    rmSync(dir, { recursive: true, force: true })
  })
})
