// Live examples per registry item: every variant and state. Used by the docs pages,
// the /fixture/:name pages, visual regression and axe tests.
import * as React from "react"
import { MemoryRouter, useInRouterContext } from "react-router-dom"
import { toast } from "sonner"
import { Menu, Copy, ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetFooter, SheetDescription } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Mark, AssemblingMark, Logo } from "@/components/lsl/brand/mark"
import { Glyph, LayerTag, LayerLegend, FounderMonogram } from "@/components/lsl/brand/glyph"
import { Section, Stack, Cluster, Grid, RuledGrid, RuledCell, TitleBlock, Divider, Container } from "@/components/lsl/layout/layout"
import { Heading, Display, Eyebrow, Lead, Text, TextLink } from "@/components/lsl/typography/typography"
import { IconButton, ButtonGroup } from "@/components/lsl/actions/icon-button"
import { Field, FormAlert, FormSuccess } from "@/components/lsl/forms/field"
import { RadioTiles } from "@/components/lsl/forms/radio-tiles"
import { SiteHeader } from "@/components/lsl/navigation/site-header"
import { SiteFooter } from "@/components/lsl/navigation/site-footer"
import { SkipLink } from "@/components/lsl/navigation/site-shell"
import { Breadcrumbs, NavLink } from "@/components/lsl/navigation/breadcrumbs"
import { TopRuleCard, MetaList, StatusBadge, Avatar } from "@/components/lsl/data-display/data-display"
import { StatusIcon } from "@/components/lsl/feedback/status-icon"
import { Callout, LinearLoader, EmptyState, ErrorState, NotFound } from "@/components/lsl/feedback/feedback"
import { Reveal, Rise } from "@/components/lsl/motion/reveal"
import { formatNOK, formatDate, formatNumber } from "@/lib/format"
import { colors } from "@/lib/lsl-tokens"

// Docs pages already run inside a router; tests do not. Only wrap when needed.
function Router({ children }) {
  return useInRouterContext() ? children : <MemoryRouter initialEntries={["/docs-example"]}>{children}</MemoryRouter>
}

function FocusDemo() {
  return (
    <Cluster gap={3}>
      <Button>Default</Button>
      <Button variant="outline">Outline</Button>
      <TextLink href="#focus">Text link</TextLink>
      <Text size="small" tone="muted">Press Tab to see the dual focus ring.</Text>
    </Cluster>
  )
}

function MarkLegend() {
  const [focus, setFocus] = React.useState(null)
  return (
    <div className="grid items-center gap-8 sm:grid-cols-2">
      <AssemblingMark focus={focus} className="w-48" />
      <ul className="space-y-2">
        {["loy", "studio", "lab"].map((k) => (
          <li key={k}>
            <button
              type="button"
              className="flex min-h-11 items-center gap-3 font-semibold"
              onMouseEnter={() => setFocus(k)}
              onMouseLeave={() => setFocus(null)}
              onFocus={() => setFocus(k)}
              onBlur={() => setFocus(null)}
            >
              <Glyph layer={k} /> {k[0].toUpperCase() + k.slice(1)}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

function FieldDemo({ withError }) {
  const [msg, setMsg] = React.useState("")
  return (
    <Stack gap={4} className="max-w-xl">
      <Field label="Name" required error={withError ? "Please write your name." : undefined}>
        <Input autoComplete="name" />
      </Field>
      <Field label="Organization or business" optional hint="So we know who we are talking to.">
        <Input autoComplete="organization" />
      </Field>
      <Field label="Message" required maxLength={500} count={msg.length}>
        <Textarea rows={4} value={msg} onChange={(e) => setMsg(e.target.value)} placeholder="What are you working on?" />
      </Field>
    </Stack>
  )
}

function TilesDemo({ withError }) {
  const [v, setV] = React.useState(withError ? undefined : "New project")
  return (
    <RadioTiles
      legend="What is this about?"
      required
      value={v}
      onValueChange={setV}
      error={withError ? "Choose what your message is about." : undefined}
      options={[
        { value: "New project", hint: "You have something to build." },
        { value: "Collaboration", hint: "You want to work on something together." },
        { value: "General question", hint: "Anything else." },
      ]}
    />
  )
}

function SheetDemo() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Open panel</Button>
      </SheetTrigger>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>Filters</SheetTitle>
        </SheetHeader>
        <div className="p-6">
          <SheetDescription>Panels slide in from an edge. Escape closes them.</SheetDescription>
        </div>
        <SheetFooter>
          <Button>Apply</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

export const EXAMPLES = {
  foundation: [
    {
      title: "Surfaces",
      render: () => (
        <div className="grid border-2 border-ink sm:grid-cols-3">
          {["paper", "alt", "ink"].map((s) => (
            <div key={s} className={`surface-${s} flex flex-col gap-3 border-b-2 border-ink p-6 last:border-b-0 sm:border-b-0 sm:border-r-2 sm:last:border-r-0`}>
              <Eyebrow>surface-{s}</Eyebrow>
              <Heading level={3}>Text follows</Heading>
              <Text tone="muted">Secondary text passes AA on every surface.</Text>
              <Cluster gap={2}>
                <Button size="sm">Default</Button>
                <Button size="sm" variant="outline">Outline</Button>
              </Cluster>
            </div>
          ))}
        </div>
      ),
    },
    { title: "Focus ring", render: () => <FocusDemo /> },
    { title: "Focus ring on ink", surface: "ink", render: () => <FocusDemo /> },
  ],
  doctor: [],
  "accent-budget": [],
  button: [
    {
      title: "Variants",
      render: () => (
        <Cluster gap={3}>
          <Button variant="accent">Accent (one per page)</Button>
          <Button>Default</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="link">Link</Button>
          <Button variant="destructive">Delete</Button>
        </Cluster>
      ),
    },
    {
      title: "Sizes and states",
      render: () => (
        <Cluster gap={3} align="center">
          <Button size="sm">Small</Button>
          <Button>Default</Button>
          <Button size="lg">Large</Button>
          <Button disabled>Disabled</Button>
          <Button disabled aria-busy="true">Sending...</Button>
          <Button>
            Next <ArrowRight aria-hidden="true" />
          </Button>
        </Cluster>
      ),
    },
    {
      title: "On ink",
      surface: "ink",
      render: () => (
        <Cluster gap={3}>
          <Button>Default</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
        </Cluster>
      ),
    },
  ],
  input: [
    {
      title: "States",
      render: () => (
        <Stack gap={4} className="max-w-md">
          <Field label="Email">
            <Input type="email" placeholder="name@organization.no" />
          </Field>
          <Field label="Email" error="That email address looks incomplete. Check for typos.">
            <Input type="email" defaultValue="hello@" />
          </Field>
          <Field label="Disabled">
            <Input disabled defaultValue="Not editable" />
          </Field>
        </Stack>
      ),
    },
  ],
  textarea: [{ title: "With counter", render: () => <FieldDemo /> }],
  label: [{ title: "Label", render: () => <Label htmlFor="demo-x">Organization</Label> }],
  select: [
    {
      title: "Select in a Field",
      render: () => (
        <div className="max-w-md">
          <Field label="Topic">
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Choose a topic" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="web">Website</SelectItem>
                <SelectItem value="app">App or internal tool</SelectItem>
                <SelectItem value="brand">Brand identity</SelectItem>
                <SelectItem value="other">Something else</SelectItem>
              </SelectContent>
            </Select>
          </Field>
        </div>
      ),
    },
  ],
  checkbox: [
    {
      title: "Checkbox",
      render: () => (
        <Stack gap={2}>
          <div className="flex items-center gap-3">
            <Checkbox id="cb1" defaultChecked />
            <Label htmlFor="cb1" className="text-base font-normal normal-case tracking-normal">Send me the occasional update</Label>
          </div>
          <div className="flex items-center gap-3">
            <Checkbox id="cb2" />
            <Label htmlFor="cb2" className="text-base font-normal normal-case tracking-normal">I have read the privacy note</Label>
          </div>
        </Stack>
      ),
    },
  ],
  "radio-group": [
    {
      title: "Square radios",
      render: () => (
        <RadioGroup defaultValue="email" aria-label="Reply by">
          {["Email", "Phone"].map((v) => (
            <div key={v} className="flex items-center gap-3">
              <RadioGroupItem value={v.toLowerCase()} id={`rg-${v}`} />
              <Label htmlFor={`rg-${v}`} className="text-base font-normal normal-case tracking-normal">{v}</Label>
            </div>
          ))}
        </RadioGroup>
      ),
    },
  ],
  switch: [
    {
      title: "Switch",
      render: () => (
        <div className="flex items-center gap-3">
          <Switch id="sw" defaultChecked />
          <Label htmlFor="sw">Notifications</Label>
        </div>
      ),
    },
  ],
  badge: [
    {
      title: "Variants",
      render: () => (
        <Cluster gap={2}>
          <Badge>Case study</Badge>
          <Badge variant="solid">New</Badge>
          <Badge variant="danger">Overdue</Badge>
          <Badge variant="signal">AI draft</Badge>
        </Cluster>
      ),
    },
  ],
  card: [
    {
      title: "Card",
      render: () => (
        <Grid cols={2}>
          <Card>
            <CardHeader>
              <CardTitle>Oslo Skatehall</CardTitle>
              <CardDescription>An operations system for a community-run skatepark.</CardDescription>
            </CardHeader>
            <CardContent>
              <LayerTag layer="studio">Studio · App</LayerTag>
            </CardContent>
            <CardFooter>
              <TextLink href="#card">Read the case</TextLink>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Snapticket</CardTitle>
              <CardDescription>Receipts and expenses, kept in one place.</CardDescription>
            </CardHeader>
            <CardContent>
              <LayerTag layer="lab">Lab · Tool</LayerTag>
            </CardContent>
          </Card>
        </Grid>
      ),
    },
  ],
  sheet: [{ title: "Sheet", render: () => <SheetDemo /> }],
  separator: [
    {
      title: "Strong and subtle",
      render: () => (
        <Stack gap={3}>
          <Text>Above</Text>
          <Separator />
          <Text>Between</Text>
          <Separator tone="subtle" />
          <Text>Below</Text>
        </Stack>
      ),
    },
  ],
  sonner: [
    {
      title: "Toasts",
      render: () => (
        <Cluster gap={3}>
          <Button variant="outline" onClick={() => toast.success("Saved", { description: "Your changes are stored." })}>Success toast</Button>
          <Button variant="outline" onClick={() => toast.error("Not sent", { description: "Check your connection and try again." })}>Error toast</Button>
        </Cluster>
      ),
    },
  ],
  skeleton: [
    {
      title: "Loading card",
      render: () => (
        <div className="max-w-sm space-y-3 border-2 border-ink p-6" aria-busy="true">
          <Skeleton className="h-6 w-2/3" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>
      ),
    },
  ],
  tooltip: [
    {
      title: "Tooltip on an icon button",
      render: () => (
        <Tooltip>
          <TooltipTrigger asChild>
            <IconButton label="Copy link">
              <Copy aria-hidden="true" />
            </IconButton>
          </TooltipTrigger>
          <TooltipContent>Copy link</TooltipContent>
        </Tooltip>
      ),
    },
  ],
  mark: [
    {
      title: "Lockups",
      render: () => (
        <Cluster gap={8} align="end">
          <Logo />
          <Logo variant="stacked" />
          <Mark size={64} title="LoyStudioLab" />
        </Cluster>
      ),
    },
    { title: "On ink", surface: "ink", render: () => <Cluster gap={8} align="end"><Logo /><Mark size={64} /></Cluster> },
    { title: "Assembling mark with legend", render: () => <MarkLegend /> },
  ],
  glyph: [
    {
      title: "Glyphs and tags",
      render: () => (
        <Stack gap={4}>
          <Cluster gap={4}>
            <Glyph layer="loy" size={24} />
            <Glyph layer="studio" size={24} />
            <Glyph layer="lab" size={24} />
          </Cluster>
          <Cluster gap={2}>
            <LayerTag layer="loy" />
            <LayerTag layer="studio">Studio · Website</LayerTag>
            <LayerTag layer="lab">Lab · Tool</LayerTag>
          </Cluster>
        </Stack>
      ),
    },
    { title: "Legend and founders", render: () => <Grid cols={2}><LayerLegend detail="line" /><Cluster gap={3}><FounderMonogram initials="ML" name="Mariana Loy Menchaca" /><FounderMonogram initials="RL" name="Ramón Loy Menchaca" /></Cluster></Grid> },
    { title: "On ink", surface: "ink", render: () => <Stack gap={4}><Cluster gap={2}><LayerTag layer="loy" /><LayerTag layer="studio" /><LayerTag layer="lab" /></Cluster><FounderMonogram initials="ML" /></Stack> },
  ],
  layout: [
    {
      title: "TitleBlock + RuledGrid",
      render: () => (
        <Stack gap={6}>
          <TitleBlock index="01" label="What we do">
            <Heading level={2}>Websites, apps and systems that fit how you work</Heading>
          </TitleBlock>
          <RuledGrid cols={3}>
            {["Digitalization", "Web and product design", "AI, as part of the process"].map((t) => (
              <RuledCell key={t}>
                <Heading level={3}>{t}</Heading>
                <Text tone="muted">Cells share 2px rules instead of floating as separate cards.</Text>
              </RuledCell>
            ))}
          </RuledGrid>
        </Stack>
      ),
    },
    {
      title: "Stack, Cluster, Divider",
      render: () => (
        <Stack gap={3}>
          <Cluster gap={2}>
            <Badge>gap 1 = 8px</Badge>
            <Badge>2 = 16px</Badge>
            <Badge>3 = 24px</Badge>
            <Badge>4 = 32px</Badge>
          </Cluster>
          <Divider />
          <Text tone="muted">Stack stacks vertically; Cluster wraps horizontally. Both use base-8 steps.</Text>
        </Stack>
      ),
    },
  ],
  typography: [
    {
      title: "Scale",
      render: () => (
        <Stack gap={4}>
          <Eyebrow>Design and technology studio in Oslo</Eyebrow>
          <Display level={2}>We design and build the digital tools small organizations run on.</Display>
          <Heading level={2} size={1}>Heading 1 size</Heading>
          <Heading level={3} size={2}>Heading 2 size</Heading>
          <Heading level={4} size={3}>Heading 3 size</Heading>
          <Lead>Lead paragraph. We help community organizations and local businesses replace the group chat, the spreadsheet and the paper folder.</Lead>
          <Text>
            Body text in Archivo, with an <TextLink href="#type">inline link</TextLink>.
          </Text>
          <Text size="small" tone="muted">Small, muted text for captions.</Text>
        </Stack>
      ),
    },
  ],
  "icon-button": [
    {
      title: "IconButton and ButtonGroup",
      render: () => (
        <Stack gap={4}>
          <Cluster gap={2}>
            <IconButton label="Open menu"><Menu aria-hidden="true" /></IconButton>
            <IconButton label="Copy link" variant="ghost"><Copy aria-hidden="true" /></IconButton>
          </Cluster>
          <ButtonGroup>
            <Button>Start a project</Button>
            <Button variant="outline">See the work</Button>
          </ButtonGroup>
          <ButtonGroup attached>
            <Button variant="outline" size="sm">Day</Button>
            <Button size="sm">Week</Button>
            <Button variant="outline" size="sm">Month</Button>
          </ButtonGroup>
        </Stack>
      ),
    },
  ],
  field: [
    { title: "Fields", render: () => <FieldDemo /> },
    { title: "With error", render: () => <FieldDemo withError /> },
    {
      title: "Form alert and success",
      render: () => (
        <Grid cols={2}>
          <FormAlert title="Your message was not sent.">Something went wrong on our side. Your text is still here, so you can try again.</FormAlert>
          <FormSuccess title="Thank you. Your message is with us." action={<Button variant="outline">Send another message</Button>}>
            We will reply within a few working days.
          </FormSuccess>
        </Grid>
      ),
    },
    { title: "On ink", surface: "ink", render: () => <FieldDemo withError /> },
  ],
  "radio-tiles": [
    { title: "RadioTiles", render: () => <TilesDemo /> },
    { title: "With error", render: () => <TilesDemo withError /> },
  ],
  "site-header": [
    {
      title: "SiteHeader (resize to see the mobile menu)",
      render: () => (
        <Router>
          <SiteHeader items={[{ label: "What we do", href: "/what" }, { label: "Work", href: "/work" }, { label: "About", href: "/about" }]} cta={{ label: "Contact", href: "/contact" }} className="static" />
        </Router>
      ),
    },
  ],
  "site-footer": [{ title: "SiteFooter", render: () => <Router><SiteFooter email="hello@loystudiolab.com" links={[{ label: "Work", href: "/work" }, { label: "About", href: "/about" }]} /></Router> }],
  "site-shell": [{ title: "SkipLink (focus it with Tab)", render: () => <div className="relative h-16"><SkipLink href="#site-shell" /></div> }],
  breadcrumbs: [
    {
      title: "Breadcrumbs and NavLink",
      render: () => (
        <Router>
          <Stack gap={4}>
            <Breadcrumbs items={[{ label: "Work", href: "/work" }, { label: "OSF HUB" }]} />
            <Cluster gap={6}>
              <NavLink to="/work" active>Work</NavLink>
              <NavLink to="/about">About</NavLink>
            </Cluster>
          </Stack>
        </Router>
      ),
    },
  ],
  "data-display": [
    {
      title: "TopRuleCard",
      render: () => (
        <Grid cols={4}>
          <TopRuleCard title="Functional honesty" bar="brick">Form follows real use.</TopRuleCard>
          <TopRuleCard title="Accessible by default" bar="ochre">For the person who never asked for design.</TopRuleCard>
          <TopRuleCard title="Structured playfulness" bar="petrol">Rigor is not the same as cold.</TopRuleCard>
          <TopRuleCard title="Systems over symptoms" bar="concrete">Every brief gets opened up first.</TopRuleCard>
        </Grid>
      ),
    },
    {
      title: "MetaList, StatusBadge, Avatar",
      render: () => (
        <Stack gap={6}>
          <MetaList cols={3} items={[{ term: "Client", detail: "Oslo Skateboardforening" }, { term: "Year", detail: "2026" }, { term: "Status", detail: "In use" }]} />
          <Cluster gap={2}>
            {["draft", "active", "done", "paused", "error", "ai"].map((s) => <StatusBadge key={s} status={s} />)}
          </Cluster>
          <Cluster gap={3}>
            <Avatar name="Kari Nordmann" size="sm" />
            <Avatar name="Ola Hansen" />
            <Avatar name="Ingrid Berg" size="lg" />
          </Cluster>
        </Stack>
      ),
    },
  ],
  "status-icon": [
    {
      title: "Status icons",
      render: () => (
        <Cluster gap={6}>
          {["info", "success", "warning", "error", "pending"].map((s) => (
            <span key={s} className="inline-flex items-center gap-2 text-sm font-semibold">
              <StatusIcon status={s} size={20} /> {s}
            </span>
          ))}
        </Cluster>
      ),
    },
  ],
  feedback: [
    {
      title: "Callouts",
      render: () => (
        <Stack gap={3}>
          <Callout title="Replies within a few working days">We read every message ourselves.</Callout>
          <Callout tone="success" title="Published">The page is live.</Callout>
          <Callout tone="warning" title="Prices exclude VAT">We add 25% MVA on the invoice.</Callout>
          <Callout tone="error" title="The file is too large">Upload a photo under 10 MB.</Callout>
        </Stack>
      ),
    },
    {
      title: "LinearLoader",
      render: () => (
        <Stack gap={4} className="max-w-md">
          <LinearLoader value={60} label="Uploading receipt" />
          <LinearLoader label="Loading projects" />
        </Stack>
      ),
    },
    {
      title: "Empty, error and not found",
      render: () => (
        <Stack gap={4}>
          <EmptyState title="No receipts yet" action={<Button>Add a receipt</Button>}>Photos of receipts you add will show up here.</EmptyState>
          <ErrorState action={<Button variant="outline">Try again</Button>} />
          <NotFound action={<Button variant="outline">Go to the front page</Button>} />
        </Stack>
      ),
    },
  ],
  reveal: [
    {
      title: "Reveal and Rise",
      render: () => (
        <Stack gap={3}>
          <Rise>
            <Heading level={3}>Rise: once, on load</Heading>
          </Rise>
          <Reveal>
            <Text tone="muted">Reveal: a 16px rise and fade when it scrolls into view. Off under reduced motion.</Text>
          </Reveal>
        </Stack>
      ),
    },
  ],
  "section-nav": [],
  "use-document-title": [],
  "use-reduced-motion": [],
  format: [
    {
      title: "Formatting",
      render: () => (
        <MetaList
          cols={3}
          items={[
            { term: "formatNOK(2500)", detail: formatNOK(2500) },
            { term: "formatNumber(1234.5, 1)", detail: formatNumber(1234.5, { decimals: 1 }) },
            { term: "formatDate(2026-11-11)", detail: formatDate("2026-11-11") },
          ]}
        />
      ),
    },
  ],
}

export { colors, Section, Container }
