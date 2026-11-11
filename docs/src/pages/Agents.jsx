import { Section, Stack, TitleBlock, RuledGrid, RuledCell } from "@/components/lsl/layout/layout"
import { Heading, Lead, Text, TextLink } from "@/components/lsl/typography/typography"
import { useDocumentTitle } from "@/hooks/use-document-title"
import { INTENTS } from "@docs/catalog"
import { Code } from "@docs/components/Docs"

const base = typeof window !== "undefined" ? `${window.location.origin}${import.meta.env.BASE_URL}` : "/"

const STEPS = [
  ["Read the index", "manifest.index.json: intents, items and rules in one small file. Do not design from memory."],
  ["Choose", "A template if one fits; otherwise sections; otherwise components."],
  ["Install", "From the registry (CLI), or write the item JSON's files directly when there is no CLI."],
  ["Write copy", "In src/data/content.js. English, no em dashes, no hype."],
  ["Fill gaps", "App-local composites in src/components/app/ from library parts only. Never edit managed files."],
  ["Check", "Run lsl-doctor, the build and an axe pass. Fix every rule ID reported."],
  ["Report", "List the library items used, any app-local composites, and any proposal written."],
]

export default function Agents() {
  useDocumentTitle("For agents", "LoyStudioLab UI")
  return (
    <>
      <Section bordered={false} aria-labelledby="ag-h">
        <TitleBlock index="A" label="For agents">
          <Heading level={1} id="ag-h">How agents use this library</Heading>
          <Lead className="mt-5">
            Claude Code agents load the loystudiolab-ui skill (StudioAgents/skills/loystudiolab-ui) and follow these steps. Every
            file below is generated from the same metadata as these docs.
          </Lead>
        </TitleBlock>
      </Section>

      <Section surface="alt" aria-labelledby="steps-h">
        <Heading level={2} id="steps-h">Decision procedure</Heading>
        <RuledGrid cols={4} className="mt-8">
          {STEPS.map(([t, d], i) => (
            <RuledCell key={t}>
              <p className="font-mono text-sm font-semibold text-ink-2">{String(i + 1).padStart(2, "0")}</p>
              <Heading level={3}>{t}</Heading>
              <Text size="small" tone="muted">{d}</Text>
            </RuledCell>
          ))}
        </RuledGrid>
      </Section>

      <Section aria-labelledby="files-h">
        <Heading level={2} id="files-h">Machine-readable files</Heading>
        <dl className="mt-6 border-t-2 border-ink">
          {[
            ["manifest.index.json", "Intents, items, rules. Read first."],
            ["manifest.json", "Everything: props, variants, do/don't, a11y, examples, file hashes."],
            ["llms.txt", "Short text index."],
            ["llms-full.txt", "Every item as text."],
            ["r/<name>.json", "shadcn registry items with file contents inlined."],
            ["tokens.css", "Plain CSS variables for non-Tailwind pages and artifacts."],
          ].map(([f, d]) => (
            <div key={f} className="grid gap-1 border-b-2 border-rule py-3 md:grid-cols-3">
              <dt>
                <TextLink href={`${import.meta.env.BASE_URL}${f.replace("<name>", "button")}`}>{f}</TextLink>
              </dt>
              <dd className="text-ink-2 md:col-span-2">{d}</dd>
            </div>
          ))}
        </dl>
      </Section>

      <Section surface="alt" aria-labelledby="install-h">
        <Heading level={2} id="install-h">Install paths</Heading>
        <Stack gap={6} className="mt-8">
          <div>
            <Heading level={3}>A. Local clone of the app (preferred)</Heading>
            <Text tone="muted" className="mt-2">Add the registry to components.json once, then install by name.</Text>
            <Code className="mt-3">{`// components.json
"registries": { "@lsl": "${base}r/{name}.json" }

npx shadcn@latest add @lsl/foundation @lsl/doctor @lsl/accent-budget --overwrite
npx shadcn@latest add @lsl/site-shell @lsl/site-header @lsl/site-footer @lsl/layout @lsl/typography`}</Code>
          </div>
          <div>
            <Heading level={3}>B. Base44 sandbox over MCP</Heading>
            <Text tone="muted" className="mt-2">Same commands through run_command, if the sandbox can reach the registry URL.</Text>
          </div>
          <div>
            <Heading level={3}>C. No CLI</Heading>
            <Text tone="muted" className="mt-2">
              Fetch r/&lt;name&gt;.json, write each files[].content to files[].target (a leading ~/ means the app root), repeat for
              registryDependencies, and add dependencies to package.json.
            </Text>
          </div>
          <div>
            <Heading level={3}>Then check</Heading>
            <Code className="mt-3">{`node scripts/lsl-doctor.mjs src          # by rule ID
node scripts/lsl-doctor.mjs src --json   # for agents`}</Code>
          </div>
        </Stack>
      </Section>

      <Section aria-labelledby="intents-h">
        <Heading level={2} id="intents-h">Intent index</Heading>
        <dl className="mt-6 border-t-2 border-ink">
          {INTENTS.map((i) => (
            <div key={i.intent} className="grid gap-1 border-b-2 border-rule py-3 md:grid-cols-2">
              <dt className="font-semibold">{i.intent}</dt>
              <dd className="font-mono text-sm text-ink-2">{i.use.join(", ")}</dd>
            </div>
          ))}
        </dl>
      </Section>
    </>
  )
}
