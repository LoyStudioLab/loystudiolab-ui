import { Link, NavLink as RouterNavLink, useParams } from "react-router-dom"

import { Section, Stack, Cluster, Grid } from "@/components/lsl/layout/layout"
import { Heading, Lead, Text, Eyebrow, TextLink } from "@/components/lsl/typography/typography"
import { Badge } from "@/components/ui/badge"
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Callout, NotFound } from "@/components/lsl/feedback/feedback"
import { StatusIcon } from "@/components/lsl/feedback/status-icon"
import { Breadcrumbs } from "@/components/lsl/navigation/breadcrumbs"
import { Button } from "@/components/ui/button"
import { useDocumentTitle } from "@/hooks/use-document-title"
import { cn } from "@/lib/utils"
import { ITEMS, RULES, byCategory, CATEGORY_LABEL } from "@docs/catalog"
import { EXAMPLES } from "@docs/examples"
import { Code, CopyLine, Example, PropsTable } from "@docs/components/Docs"

const ruleText = Object.fromEntries(RULES.map((r) => [r.id, r.rule]))

function Sidebar({ current }) {
  return (
    <nav aria-label="Components" className="lg:sticky lg:top-[calc(var(--lsl-header-h)+1.5rem)] lg:max-h-[calc(100vh-var(--lsl-header-h)-3rem)] lg:overflow-y-auto">
      <ul className="space-y-6">
        {byCategory().map(([cat, items]) => (
          <li key={cat}>
            <p className="eyebrow mb-2">{CATEGORY_LABEL[cat]}</p>
            <ul className="space-y-1">
              {items.map((it) => (
                <li key={it.name}>
                  <RouterNavLink
                    to={`/components/${it.name}`}
                    className={cn(
                      "block border-l-[3px] py-1 pl-3 text-sm font-semibold",
                      current === it.name ? "border-butter text-ink" : "border-transparent text-ink-2 hover:border-ink hover:text-ink"
                    )}
                  >
                    {it.title.split(":")[0]}
                  </RouterNavLink>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export function ComponentIndex() {
  useDocumentTitle("Components", "LoyStudioLab UI")
  return (
    <Section bordered={false} aria-labelledby="ci-h">
      <Stack gap={3}>
        <Eyebrow>Components</Eyebrow>
        <Heading level={1} id="ci-h">Every item in the registry</Heading>
        <Lead>Pick a template first, then sections, then components. Each page lists when to use it, when not to, and the rules it carries.</Lead>
      </Stack>
      <div className="mt-12 space-y-12">
        {byCategory().map(([cat, items]) => (
          <section key={cat} aria-labelledby={`cat-${cat}`}>
            <Heading level={2} size={3} id={`cat-${cat}`} className="mb-4">{CATEGORY_LABEL[cat]}</Heading>
            <Grid cols={3} gap={2}>
              {items.map((it) => (
                <Card key={it.name} className="relative transition-colors duration-fast hover:bg-paper-alt">
                  <CardHeader>
                    <Cluster gap={1}>
                      <Badge>{it.layer}</Badge>
                      {it.status !== "stable" && <Badge variant="solid">{it.status}</Badge>}
                    </Cluster>
                    <CardTitle as="h3">
                      <Link to={`/components/${it.name}`} className="after:absolute after:inset-0 after:content-['']">
                        {it.title.split(":")[0]}
                      </Link>
                    </CardTitle>
                    <CardDescription>{it.purpose}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </Grid>
          </section>
        ))}
      </div>
    </Section>
  )
}

export default function Components() {
  const { name } = useParams()
  const item = ITEMS.find((i) => i.name === name)
  useDocumentTitle(item ? item.title.split(":")[0] : "Not found", "LoyStudioLab UI")
  if (!item) {
    return (
      <Section bordered={false}>
        <NotFound title="No component with that name" action={<Button asChild variant="outline"><Link to="/components">All components</Link></Button>} />
      </Section>
    )
  }
  const examples = EXAMPLES[item.name] ?? []
  return (
    <Section bordered={false} space="sm" aria-labelledby="item-h">
      <div className="grid gap-12 lg:grid-cols-12">
        <div className="hidden lg:col-span-3 lg:block">
          <Sidebar current={item.name} />
        </div>
        <article className="min-w-0 lg:col-span-9">
          <Stack gap={4}>
            <Breadcrumbs items={[{ label: "Components", href: "/components" }, { label: item.title.split(":")[0] }]} />
            <Cluster gap={1}>
              <Badge>{CATEGORY_LABEL[item.category]}</Badge>
              <Badge>{item.layer}</Badge>
              <Badge variant={item.status === "stable" ? "default" : "solid"}>{item.status}</Badge>
            </Cluster>
            <Heading level={1} id="item-h">{item.title}</Heading>
            <Lead>{item.purpose}</Lead>
            <CopyLine text={`npx shadcn@latest add @lsl/${item.name}`} />
            <Text size="small" tone="muted">
              Installs {item.files.map((f) => f.target).join(", ")}
              {item.dependencies?.length ? `. npm: ${item.dependencies.join(", ")}` : ""}
              {item.registryDependencies?.length ? `. Also brings: ${item.registryDependencies.join(", ")}` : ""}.
            </Text>
          </Stack>

          {item.setup && (
            <Callout tone="warning" title="Setup after install" className="mt-8">
              <ol className="list-decimal space-y-1 pl-5">
                {item.setup.map((s) => <li key={s}>{s}</li>)}
              </ol>
            </Callout>
          )}

          <Grid cols={2} gap={0} className="mt-12 border-2 border-ink">
            <div className="border-b-2 border-ink p-6 md:border-b-0 md:border-r-2">
              <p className="label-caps flex items-center gap-2"><StatusIcon status="success" /> Use when</p>
              <ul className="mt-3 list-disc space-y-1 pl-5 text-ink-2">
                {item.useWhen.map((u) => <li key={u}>{u}</li>)}
              </ul>
            </div>
            <div className="p-6">
              <p className="label-caps flex items-center gap-2"><StatusIcon status="error" className="text-brick-deep" /> Do not use when</p>
              {item.dontUseWhen?.length ? (
                <ul className="mt-3 list-disc space-y-1 pl-5 text-ink-2">
                  {item.dontUseWhen.map((d) => <li key={d.case}>{d.case}: use <strong className="text-ink">{d.use}</strong></li>)}
                </ul>
              ) : (
                <p className="mt-3 text-ink-2">No known misuse yet.</p>
              )}
            </div>
          </Grid>

          {examples.length > 0 && (
            <section aria-labelledby="ex-h" className="mt-12">
              <Heading level={2} size={3} id="ex-h">Examples</Heading>
              <div className="mt-4 space-y-6">
                {examples.map((ex) => (
                  <Example key={ex.title} title={ex.title} surface={ex.surface}>{ex.render()}</Example>
                ))}
              </div>
            </section>
          )}

          <section aria-labelledby="code-h" className="mt-12">
            <Heading level={2} size={3} id="code-h">Usage</Heading>
            <Code className="mt-4">{item.example}</Code>
          </section>

          <section aria-labelledby="props-h" className="mt-12">
            <Heading level={2} size={3} id="props-h">API</Heading>
            <div className="mt-4 space-y-8">
              {item.exports.map((ex) => (
                <div key={ex.name}>
                  <p className="mb-2 font-mono text-sm font-semibold">{ex.name}{ex.kind ? <span className="ml-2 font-body text-xs uppercase tracking-[0.08em] text-ink-2">{ex.kind}</span> : null}</p>
                  {!ex.kind || ex.props.length ? <PropsTable props={ex.props} label={`${ex.name} props`} /> : null}
                </div>
              ))}
            </div>
          </section>

          {item.classes && (
            <section aria-labelledby="classes-h" className="mt-12">
              <Heading level={2} size={3} id="classes-h">Classes the preset adds</Heading>
              <dl className="mt-4 space-y-3">
                {item.classes.map((c) => (
                  <div key={c.name} className="grid gap-1 border-t-2 border-rule pt-3 md:grid-cols-3">
                    <dt className="font-mono text-sm font-semibold">{c.name}</dt>
                    <dd className="text-ink-2 md:col-span-2">{c.purpose}</dd>
                  </div>
                ))}
              </dl>
            </section>
          )}

          <Grid cols={2} gap={4} className="mt-12">
            <section aria-labelledby="rules-h">
              <Heading level={2} size={3} id="rules-h">Rules</Heading>
              <ul className="mt-4 space-y-2">
                {item.rules.map((r) => (
                  <li key={r} className="flex gap-3 text-sm">
                    <Link to={`/rules#${r}`} className="shrink-0 font-mono font-semibold underline decoration-butter decoration-2 underline-offset-4">{r}</Link>
                    <span className="text-ink-2">{ruleText[r]}</span>
                  </li>
                ))}
              </ul>
            </section>
            <section aria-labelledby="a11y-h">
              <Heading level={2} size={3} id="a11y-h">Accessibility</Heading>
              {item.a11y?.length ? (
                <ul className="mt-4 list-disc space-y-1 pl-5 text-sm text-ink-2">
                  {item.a11y.map((a) => <li key={a}>{a}</li>)}
                </ul>
              ) : (
                <p className="mt-4 text-sm text-ink-2">Covered by the foundation (focus, contrast, reduced motion).</p>
              )}
            </section>
          </Grid>

          <p className="mt-12 text-sm text-ink-2">
            Machine-readable: <TextLink href={`${import.meta.env.BASE_URL}r/${item.name}.json`}>r/{item.name}.json</TextLink> ·{" "}
            <TextLink href={`${import.meta.env.BASE_URL}fixture/${item.name}`}>fixture page</TextLink>
          </p>
        </article>
      </div>
    </Section>
  )
}
