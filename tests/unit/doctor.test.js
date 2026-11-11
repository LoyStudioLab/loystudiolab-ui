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
