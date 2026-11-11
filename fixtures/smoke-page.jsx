// Sample page used by the smoke test: composes library parts the way an agent should.
import { BrowserRouter } from "react-router-dom"
import { SiteShell } from "@/components/lsl/navigation/site-shell"
import { SiteHeader } from "@/components/lsl/navigation/site-header"
import { SiteFooter } from "@/components/lsl/navigation/site-footer"
import { Section, TitleBlock, RuledGrid, RuledCell, Stack, Cluster } from "@/components/lsl/layout/layout"
import { Heading, Display, Eyebrow, Lead, Text, TextLink } from "@/components/lsl/typography/typography"
import { Button } from "@/components/ui/button"
import { LayerTag, FounderMonogram } from "@/components/lsl/brand/glyph"
import { Field } from "@/components/lsl/forms/field"
import { Input } from "@/components/ui/input"
import { Callout } from "@/components/lsl/feedback/feedback"
import { AccentBudget } from "@/components/lsl/dev/accent-budget"
import { Toaster } from "@/components/ui/sonner"

export default function App() {
  return (
    <BrowserRouter>
      <AccentBudget />
      <Toaster />
      <SiteShell
        header={<SiteHeader items={[{ id: "work", label: "Work" }, { id: "about", label: "About" }]} cta={{ label: "Contact", href: "/#contact", id: "contact" }} />}
        footer={<SiteFooter email="hello@loystudiolab.com" />}
      >
        <Section bordered={false} space="lg" aria-labelledby="hero-h">
          <Stack gap={4}>
            <Eyebrow>Design and technology studio in Oslo</Eyebrow>
            <Display id="hero-h">We design and build the digital tools small organizations run on.</Display>
            <Lead>Websites, apps and systems for community organizations and local businesses.</Lead>
            <Cluster gap={2}>
              <Button variant="accent" size="lg">Tell us what you are working on</Button>
              <Button variant="outline" size="lg">See the work</Button>
            </Cluster>
          </Stack>
        </Section>
        <Section id="work" surface="alt" aria-labelledby="work-h">
          <TitleBlock index="01" label="Work">
            <Heading level={2} id="work-h">Projects we can show</Heading>
          </TitleBlock>
          <RuledGrid cols={2} className="mt-12">
            <RuledCell>
              <LayerTag layer="studio">Studio · App</LayerTag>
              <Heading level={3}>OSF HUB</Heading>
              <Text tone="muted">The app the crew at Oslo Skatehall and SKUR13 use to run the parks.</Text>
            </RuledCell>
            <RuledCell>
              <LayerTag layer="lab">Lab · Tool</LayerTag>
              <Heading level={3}>Snapticket</Heading>
              <Text tone="muted">Receipts and expenses, kept in one place.</Text>
            </RuledCell>
          </RuledGrid>
        </Section>
        <Section id="about" aria-labelledby="about-h">
          <Stack gap={3}>
            <Heading level={2} id="about-h">Two of us</Heading>
            <Cluster gap={3}>
              <FounderMonogram initials="ML" />
              <Text>Mariana Loy Menchaca. <TextLink href="#contact">Get in touch</TextLink>.</Text>
            </Cluster>
            <Callout title="Replies within a few working days">We read every message ourselves.</Callout>
          </Stack>
        </Section>
        <Section id="contact" surface="ink" aria-labelledby="contact-h">
          <Stack gap={4} className="max-w-xl">
            <Heading level={2} id="contact-h">Have a problem worth solving properly?</Heading>
            <Field label="Email" required>
              <Input type="email" autoComplete="email" />
            </Field>
            <Button>Send</Button>
          </Stack>
        </Section>
      </SiteShell>
    </BrowserRouter>
  )
}
