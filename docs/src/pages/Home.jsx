import { Link } from "react-router-dom"

import { Section, Stack, Cluster, RuledGrid, RuledCell, TitleBlock } from "@/components/lsl/layout/layout"
import { Display, Eyebrow, Lead, Heading, Text, TextLink } from "@/components/lsl/typography/typography"
import { Button } from "@/components/ui/button"
import { AssemblingMark } from "@/components/lsl/brand/mark"
import { LayerLegend } from "@/components/lsl/brand/glyph"
import { Rise, Reveal } from "@/components/lsl/motion/reveal"
import { useDocumentTitle } from "@/hooks/use-document-title"
import { ITEMS, RULES } from "@docs/catalog"

const PRINCIPLES = [
  { title: "Shape", text: "Three solids, one deliberately hollow. A circle for the two of us, a square for client work, an open triangle for our own experiments. The shapes mean nothing else." },
  { title: "Color", text: "Paper dominates, ink carries structure, butter yellow appears once per page. Restraint is the signal of confidence, not its absence." },
  { title: "Type", text: "Jost, a revival of Koch's 1927 Kabel, for display. Archivo, a working grotesque, for reading. The display face carries the argument; the body face carries the reading." },
  { title: "Grid", text: "2px borders, radius 0, no shadows, no gradients. An exposed structure, because legibility and honesty are the same property seen from two directions." },
]

export default function Home() {
  useDocumentTitle("Principles", "LoyStudioLab UI")
  return (
    <>
      <Section bordered={false} space="lg" aria-labelledby="home-h">
        <div className="grid items-center gap-12 lg:grid-cols-12">
          <Stack gap={4} className="lg:col-span-8">
            <Rise>
              <Eyebrow>LoyStudioLab UI · v0.1</Eyebrow>
            </Rise>
            <Rise delay={0.05}>
              <Display id="home-h">One set of parts for everything the studio builds.</Display>
            </Rise>
            <Rise delay={0.1}>
              <Lead>
                Tokens, components and rules for our own sites and Lab products. Built so that every screen, and every agent that
                builds one, starts from the same decisions instead of making them again.
              </Lead>
            </Rise>
            <Rise delay={0.15}>
              <Cluster gap={2}>
                <Button asChild variant="accent" size="lg">
                  <Link to="/components">Browse components</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link to="/agents">For agents</Link>
                </Button>
              </Cluster>
            </Rise>
          </Stack>
          <div className="lg:col-span-4">
            <AssemblingMark className="mx-auto w-full max-w-[16rem]" />
            <LayerLegend detail="short" className="mt-8" />
          </div>
        </div>
      </Section>

      <Section surface="alt" aria-labelledby="principles-h">
        <TitleBlock index="01" label="Principles">
          <Heading level={2} id="principles-h">One argument, repeated at every scale</Heading>
          <Lead className="mt-5">
            The library embodies the studio&apos;s aesthetic philosophy: rigor and warmth are not opposites. Every token below is a
            consequence of that position, not a style choice.
          </Lead>
        </TitleBlock>
        <RuledGrid cols={4} className="mt-12">
          {PRINCIPLES.map((p, i) => (
            <RuledCell key={p.title}>
              <Reveal delay={i * 0.06}>
                <Heading level={3}>{p.title}</Heading>
                <Text tone="muted" className="mt-3">{p.text}</Text>
              </Reveal>
            </RuledCell>
          ))}
        </RuledGrid>
      </Section>

      <Section aria-labelledby="numbers-h">
        <TitleBlock index="02" label="What is here">
          <Heading level={2} id="numbers-h">What is in version 0.1</Heading>
          <Text tone="muted" className="mt-5 max-w-prose">
            {ITEMS.length} registry items and {RULES.length} rules. Each rule has an ID that the docs, the manifest, the{" "}
            <TextLink asChild>
              <Link to="/agents">lsl-doctor checks and the agent skill</Link>
            </TextLink>{" "}
            all share. Phase 1 covers foundations, brand, layout, type, actions, core forms, site
            navigation, feedback and motion. Marketing sections and page templates come next, then the product and AI layers.
          </Text>
        </TitleBlock>
      </Section>
    </>
  )
}
