import { Section, Stack, Grid, TitleBlock } from "@/components/lsl/layout/layout"
import { Heading, Lead, Text, Eyebrow } from "@/components/lsl/typography/typography"
import { Badge } from "@/components/ui/badge"
import { colors, surfaces, type } from "@/lib/lsl-tokens"
import { useDocumentTitle } from "@/hooks/use-document-title"
import { Example } from "@docs/components/Docs"
import { EXAMPLES } from "@docs/examples"

const NOTES = {
  paper: "Dominant surface",
  "paper-alt": "Alternating sections",
  ink: "Text, borders, ink surfaces",
  "ink-2": "Secondary text",
  concrete: "Non-text only",
  rule: "Decorative dividers; text on ink",
  butter: "One CTA, focus, Studio square",
  petrol: "Loy layer only",
  "petrol-light": "Loy on ink",
  brick: "Errors (borders, icons)",
  "brick-deep": "Error text on paper",
  "brick-light": "Error text on ink",
  ochre: "Value bars, charts",
  signal: "AI / computing only",
  "signal-ink": "Signal as text on paper",
}

const lum = (hex) => {
  const ch = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4))
  return 0.2126 * ch[0] + 0.7152 * ch[1] + 0.0722 * ch[2]
}
const ratio = (a, b) => {
  const [x, y] = [lum(a), lum(b)]
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05)
}

export default function Foundations() {
  useDocumentTitle("Foundations", "LoyStudioLab UI")
  const bgs = ["paper", "paper-alt", "ink"]
  return (
    <>
      <Section bordered={false} aria-labelledby="f-h">
        <TitleBlock index="F" label="Foundations">
          <Heading level={1} id="f-h">Tokens, type and surfaces</Heading>
          <Lead className="mt-5">
            Everything here is generated from one file, tokens/tokens.json, and shipped to apps as a Tailwind preset by
            @lsl/foundation.
          </Lead>
        </TitleBlock>
      </Section>

      <Section surface="alt" aria-labelledby="color-h">
        <Heading level={2} id="color-h">Color</Heading>
        <Text tone="muted" className="mt-3 max-w-prose">
          Hierarchy, not inventory: paper sets the temperature, ink carries structure, butter carries the single &quot;act now&quot;.
        </Text>
        <ul className="mt-10 grid grid-cols-2 border-l-2 border-t-2 border-ink sm:grid-cols-3 lg:grid-cols-5">
          {Object.entries(colors).map(([name, hex]) => (
            <li key={name} className="flex flex-col border-b-2 border-r-2 border-ink bg-paper">
              <div className="h-20 border-b-2 border-ink" style={{ background: hex }} />
              <div className="p-3">
                <p className="font-semibold">{name}</p>
                <p className="font-mono text-xs text-ink-2">{hex}</p>
                <p className="mt-1 text-xs text-ink-2">{NOTES[name]}</p>
              </div>
            </li>
          ))}
        </ul>
      </Section>

      <Section aria-labelledby="contrast-h">
        <Heading level={2} id="contrast-h">Contrast matrix</Heading>
        <Text tone="muted" className="mt-3 max-w-prose">
          WCAG ratio of each color as text on each surface. AA needs 4.5 for normal text. Cells below 4.5 are not allowed as text
          (rule C5); CI fails if an allowed pair drops below it.
        </Text>
        <div tabIndex={0} role="region" aria-label="Contrast ratios table" className="relative mt-8 overflow-x-auto border-2 border-ink">
          <table className="w-full min-w-[32rem] border-collapse text-sm">
            <thead className="bg-paper-alt">
              <tr>
                <th scope="col" className="border-b-2 border-ink px-4 py-2 text-left label-caps">Text color</th>
                {bgs.map((b) => (
                  <th key={b} scope="col" className="border-b-2 border-ink px-4 py-2 text-left label-caps">on {b}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Object.entries(colors).map(([name, hex]) => (
                <tr key={name} className="border-t-2 border-rule first:border-t-0">
                  <th scope="row" className="px-4 py-2 text-left font-semibold">{name}</th>
                  {bgs.map((b) => {
                    const r = ratio(hex, colors[b])
                    const ok = r >= 4.5
                    return (
                      <td key={b} className="px-4 py-2">
                        <span className={ok ? "font-semibold tabular-nums" : "tabular-nums text-ink-2 line-through"}>{r.toFixed(2)}</span>
                        {ok && <span className="sr-only"> passes</span>}
                        {!ok && <span className="sr-only"> fails</span>}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section surface="alt" aria-labelledby="type-h">
        <Heading level={2} id="type-h">Type</Heading>
        <Stack gap={0} className="mt-8 border-t-2 border-ink">
          {Object.entries(type).map(([name, t]) => (
            <div key={name} className="grid gap-2 border-b-2 border-rule py-4 md:grid-cols-12 md:items-baseline">
              <div className="md:col-span-8">
                <span
                  style={{
                    fontFamily: t.family === "display" ? "var(--lsl-font-display)" : "var(--lsl-font-body)",
                    fontSize: t.size,
                    fontWeight: t.weight,
                    letterSpacing: t.tracking,
                    lineHeight: t.lineHeight,
                    textTransform: t.transform ?? "none",
                  }}
                >
                  {name === "display" ? "Display" : name === "eyebrow" ? "Eyebrow label" : name === "label" ? "UI label" : name[0].toUpperCase() + name.slice(1)}
                </span>
              </div>
              <p className="font-mono text-xs text-ink-2 md:col-span-4">
                {t.family === "display" ? "Jost" : "Archivo"} {t.weight} · {t.size} · board {t.board}
              </p>
            </div>
          ))}
        </Stack>
      </Section>

      <Section aria-labelledby="space-h">
        <Heading level={2} id="space-h">Spacing and shape</Heading>
        <Text tone="muted" className="mt-3 max-w-prose">Base-8 grid. Borders 2px, always. Radius 0, everywhere. No shadows, no gradients.</Text>
        <div className="mt-8 flex flex-wrap items-end gap-6">
          {[8, 16, 24, 32, 48, 64, 96].map((n) => (
            <div key={n} className="flex flex-col items-center gap-2">
              <div className="bg-ink" style={{ width: n, height: n }} />
              <span className="font-mono text-xs text-ink-2">{n}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section surface="alt" aria-labelledby="surface-h">
        <Heading level={2} id="surface-h">Surfaces</Heading>
        <Text tone="muted" className="mt-3 max-w-prose">
          A surface sets the contextual colors (fg, fg-2, line, danger, loy, signal-fg, tint) for everything inside it. Components
          read those, so a Button or a Field works on ink without extra props.
        </Text>
        <Grid cols={3} gap={2} className="mt-8">
          {Object.entries(surfaces).map(([name, s]) => (
            <div key={name} className="border-2 border-ink bg-paper p-4">
              <Eyebrow>surface-{name}</Eyebrow>
              <dl className="mt-3 grid grid-cols-2 gap-1 font-mono text-xs">
                {Object.entries(s).map(([k, v]) => (
                  <div key={k} className="contents">
                    <dt className="text-ink-2">{k}</dt>
                    <dd>{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          ))}
        </Grid>
        <div className="mt-8 space-y-6">
          {EXAMPLES.foundation.map((ex) => (
            <Example key={ex.title} title={ex.title} surface={ex.surface}>
              {ex.render()}
            </Example>
          ))}
        </div>
        <Badge className="mt-6">tokens.css for non-Tailwind pages: /tokens.css</Badge>
      </Section>
    </>
  )
}
