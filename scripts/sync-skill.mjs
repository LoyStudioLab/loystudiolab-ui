// Generates agents/loystudiolab-ui/references/rules.md from registry/rules.js and copies
// the skill to LoyStudioLab/StudioAgents/skills/loystudiolab-ui/ (where studio skills live).
import { writeFileSync, cpSync, existsSync, rmSync } from "node:fs"
import { resolve } from "node:path"
import { loadItems, root, VERSION } from "./lib/registry.mjs"

const { RULES } = await loadItems()
const groups = [...new Set(RULES.map((r) => r.group))]
const md = `# Rules (generated from registry/rules.js, library ${VERSION})

Every rule has an ID. lsl-doctor, the manifest and the docs use the same IDs.
Rationale sections (§) refer to \`LoyStudioLab/Website/AESTHETIC_PHILOSOPHY.md\`.

${groups
  .map(
    (g) => `## ${g}

| ID | Rule | Why | Checked by |
|---|---|---|---|
${RULES.filter((r) => r.group === g)
  .map((r) => `| ${r.id} | ${r.rule.replace(/\|/g, "\\|")} | ${r.why.replace(/\|/g, "\\|")} | ${r.check} |`)
  .join("\n")}`
  )
  .join("\n\n")}
`
const skill = resolve(root, "agents/loystudiolab-ui")
writeFileSync(resolve(skill, "references/rules.md"), md)

// Workspace skills folder: OKF layout (_shared/agents/skills) from loystudiolab-ui/ or
// studio/ui-library/, or the legacy StudioAgents/skills.
const skillsDir = ["../_shared/agents/skills", "../../_shared/agents/skills", "../StudioAgents/skills"]
  .map((p) => resolve(root, p))
  .find((p) => existsSync(p))
const target = skillsDir && resolve(skillsDir, "loystudiolab-ui")
if (skillsDir) {
  rmSync(target, { recursive: true, force: true })
  cpSync(skill, target, { recursive: true })
  writeFileSync(
    resolve(target, "SYNCED_FROM.md"),
    `Generated copy. Source: loystudiolab-ui/agents/loystudiolab-ui (library ${VERSION}).\nEdit the source, then run \`npm run sync:skill\` in loystudiolab-ui.\n`
  )
  console.log(`skill synced to ${target}`)
} else {
  console.log("No workspace skills folder found; wrote references/rules.md only.")
}
