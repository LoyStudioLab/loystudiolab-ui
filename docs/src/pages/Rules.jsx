import { Section, Stack } from "@/components/lsl/layout/layout"
import { Heading, Lead, Eyebrow, TextLink } from "@/components/lsl/typography/typography"
import { Badge } from "@/components/ui/badge"
import { useDocumentTitle } from "@/hooks/use-document-title"
import { RULES } from "@docs/catalog"

export default function Rules() {
  useDocumentTitle("Rules", "LoyStudioLab UI")
  const groups = [...new Set(RULES.map((r) => r.group))]
  return (
    <Section bordered={false} aria-labelledby="rules-h">
      <Stack gap={3}>
        <Eyebrow>Rules</Eyebrow>
        <Heading level={1} id="rules-h">The rules, by ID</Heading>
        <Lead>
          The same IDs appear in component docs, the manifest, lsl-doctor output and the agent skill. The reasoning behind them is in
          the studio&apos;s aesthetic philosophy.
        </Lead>
      </Stack>
      <div className="mt-12 space-y-12">
        {groups.map((g) => (
          <section key={g} aria-labelledby={`g-${g}`}>
            <Heading level={2} size={3} id={`g-${g}`}>{g}</Heading>
            <dl className="mt-4 border-t-2 border-ink">
              {RULES.filter((r) => r.group === g).map((r) => (
                <div key={r.id} id={r.id} className="grid gap-2 border-b-2 border-rule py-4 md:grid-cols-12">
                  <dt className="font-mono text-lg font-semibold md:col-span-1">{r.id}</dt>
                  <dd className="md:col-span-8">
                    <p className="font-semibold">{r.rule}</p>
                    {r.why && <p className="mt-1 text-sm text-ink-2">{r.why}</p>}
                  </dd>
                  <dd className="md:col-span-3 md:text-right">
                    <Badge>{r.check}</Badge>
                  </dd>
                </div>
              ))}
            </dl>
          </section>
        ))}
      </div>
      <p className="mt-12 text-sm text-ink-2">
        Full text: <TextLink href={`${import.meta.env.BASE_URL}llms-full.txt`}>llms-full.txt</TextLink>
      </p>
    </Section>
  )
}
