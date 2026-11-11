// L2: LoyStudioLab components (brand, layout, typography, forms, navigation, feedback, motion)
// and L0 hooks/lib. Installed under src/components/lsl/, src/hooks/ and src/lib/.
const item = (name, path, extra) => ({
  name,
  layer: "L2",
  status: "stable",
  type: path.startsWith("hooks/") ? "registry:hook" : path.startsWith("lib/") ? "registry:lib" : "registry:component",
  files: [{ path, type: path.startsWith("hooks/") ? "registry:hook" : path.startsWith("lib/") ? "registry:lib" : "registry:component", target: `src/${path}` }],
  dependencies: [],
  ...extra,
  registryDependencies: ["@lsl/foundation", ...(extra.registryDependencies ?? [])],
})
const p = (name, type, def, description, required) => ({ name, type, default: def, description, ...(required ? { required: true } : {}) })
const AS = p("as", "element type", "varies", "Rendered element.")
const CLASS = p("className", "string", "", "Extra classes for spacing or placement only. Never colors, radius or shadows.")

export default [
  // ── Brand ────────────────────────────────────────────────────────────────
  item("mark", "components/lsl/brand/mark.jsx", {
    title: "Mark, AssemblingMark, Logo",
    category: "brand",
    purpose: "The LoyStudioLab mark and wordmark lockups. INTERIM geometry until the final logo is delivered.",
    exports: [
      { name: "Mark", props: [p("size", "number", "40", "Pixel size."), p("title", "string", "", "Accessible name; omit when decorative (e.g. next to the wordmark)."), CLASS] },
      { name: "AssemblingMark", props: [p("focus", "'loy' | 'studio' | 'lab' | null", "null", "Dims the other two shapes, for a legend that points at one layer."), p("className", "string", "", "Set the width here: w-40 sm:w-56 lg:w-72 in a hero; it scales from its viewBox.")] },
      { name: "Logo", props: [p("variant", "'horizontal' | 'stacked' | 'mark'", "horizontal", "horizontal for headers and footers; stacked LOY/STUDIO/LAB for covers; mark alone for tight spaces."), p("size", "number", "", "Mark size override."), p("title", "string", "LoyStudioLab", "Accessible name when variant is mark."), CLASS] },
      { name: "MARK_GEOMETRY", kind: "constant", props: [] },
    ],
    useWhen: ["Site header and footer (Logo).", "Hero diagrams explaining the name (AssemblingMark).", "Favicons and covers (Mark, Logo stacked)."],
    dontUseWhen: [{ case: "Decorating a section", use: "Nothing. The mark is a signature, not an ornament (M1)." }, { case: "Redrawing the shapes by hand", use: "Glyph or MARK_GEOMETRY" }],
    rules: ["S1", "C2", "W5"],
    a11y: ["Logo inside a link: give the link aria-label=\"LoyStudioLab, home\"."],
    example: `<Logo />
<Logo variant="stacked" />
<AssemblingMark focus={hovered} className="w-64" />`,
  }),
  item("glyph", "components/lsl/brand/glyph.jsx", {
    title: "Glyph, LayerTag, LayerLegend, FounderMonogram",
    category: "brand",
    purpose: "The three layer marks (Loy circle, Studio square, Lab hollow triangle) and the tags, legend and founder monogram built from them.",
    exports: [
      { name: "Glyph", props: [p("layer", "'loy' | 'studio' | 'lab'", "", "Which layer.", true), p("size", "number", "14", ""), CLASS] },
      { name: "LayerTag", props: [p("layer", "'loy' | 'studio' | 'lab'", "", "", true), p("children", "node", "layer name", "Label, e.g. \"Studio · Website\"."), CLASS] },
      { name: "LayerLegend", props: [p("layers", "object", "LAYERS", "Override copy per layer. LAYERS is canonical brand copy and the one allowed exception to W6; pass content.js copy here when a page explains the layers in its own words."), p("detail", "'short' | 'line'", "short", "Short label or full sentence. A compact key: for a full section explaining the layers, compose Glyph + Heading in RuledCells instead."), CLASS] },
      { name: "FounderMonogram", props: [p("initials", "string", "", "", true), p("name", "string", "", "Accessible name; omit when the name is printed next to it."), p("size", "number", "56", ""), CLASS] },
      { name: "LAYERS", kind: "constant", props: [] },
    ],
    useWhen: ["Tagging work as Studio or Lab, people as Loy.", "Explaining the three marks (footer, menu, about page).", "Founder avatars."],
    dontUseWhen: [
      { case: "Any other meaning (steps, features, Props/People/Process)", use: "Numbers or words, never shapes (S1)" },
      { case: "Avatars for anyone who is not a founder", use: "Avatar (square)" },
      { case: "Generic category tags", use: "Badge" },
    ],
    rules: ["S1", "S2", "C3"],
    a11y: ["Glyphs are decorative; the layer name is always printed next to them."],
    example: `// work: "<Layer> · <kind>"; people: layer="loy", label "Loy · Founder"
<LayerTag layer="studio">Studio · Website</LayerTag>
<LayerTag layer="loy">Loy · Founder</LayerTag>
<LayerTag layer="lab" />
<FounderMonogram initials="ML" />`,
  }),

  // ── Layout ───────────────────────────────────────────────────────────────
  item("layout", "components/lsl/layout/layout.jsx", {
    title: "Layout: Container, Section, Stack, Cluster, Grid, RuledGrid, TitleBlock, Divider",
    category: "layout",
    purpose: "Page bands with surfaces, base-8 spacing stacks, responsive grids and the exposed ruled grid.",
    exports: [
      { name: "Container", props: [AS, p("width", "'site' | 'prose'", "site", "1280px column or a ~65ch reading column."), CLASS] },
      { name: "Section", props: [AS, p("surface", "'paper' | 'alt' | 'ink'", "paper", "Sets colors for everything inside. Alternate paper and alt; use ink for one emphasis band (e.g. the closing CTA)."), p("space", "'sm' | 'md' | 'lg'", "md", "Vertical padding."), p("bordered", "boolean", "true", "2px ink rule on top."), p("contained", "boolean", "true", "Wrap children in container-site."), CLASS] },
      { name: "Stack", props: [AS, p("gap", "0 | 1 | 2 | 3 | 4 | 6 | 8", "3", "Grid steps: 1 = 8px … 8 = 64px."), p("align", "'start' | 'center' | 'end' | 'baseline' | 'stretch'", "stretch", ""), CLASS] },
      { name: "Cluster", props: [AS, p("gap", "0 | 1 | 2 | 3 | 4 | 6 | 8", "2", ""), p("align", "'start' | 'center' | 'end' | 'baseline' | 'stretch'", "center", ""), p("justify", "'start' | 'center' | 'end' | 'between'", "start", ""), p("wrap", "boolean", "true", ""), CLASS] },
      { name: "Grid", props: [AS, p("cols", "1 | 2 | 3 | 4 | 6 | 12", "3", "Columns at full width; collapses on small screens."), p("gap", "0 | 1 | 2 | 3 | 4 | 6 | 8", "4", ""), p("align", "'start' | 'center' | 'end' | 'baseline' | 'stretch'", "stretch", "Vertical alignment of cells."), CLASS] },
      { name: "RuledGrid", props: [AS, p("cols", "1 | 2 | 3 | 4 | 6 | 12", "3", ""), CLASS] },
      { name: "RuledCell", props: [AS, CLASS] },
      { name: "TitleBlock", props: [p("index", "string | number", "", "Section number, e.g. \"01\"."), p("label", "string", "", "Section label (eyebrow)."), p("children", "node", "", "Heading, lead, content."), CLASS] },
      { name: "Divider", props: [p("tone", "'strong' | 'subtle'", "strong", ""), CLASS] },
    ],
    useWhen: ["Every page: Sections stacked, each with a surface.", "Parallel items that belong together: RuledGrid + RuledCell.", "Numbered page sections: TitleBlock."],
    dontUseWhen: [{ case: "Arbitrary margins and paddings", use: "Stack / Cluster gaps on the base-8 scale (G5)" }],
    rules: ["G2", "G5", "C2"],
    a11y: ["Section renders <section>; give it aria-labelledby pointing at its heading id."],
    example: `<Section surface="alt" aria-labelledby="work-h">
  <TitleBlock index="03" label="Work">
    <Heading level={2} id="work-h">Projects we can show</Heading>
  </TitleBlock>
  <RuledGrid cols={3} className="mt-12">
    <RuledCell><Heading level={3}>Digitalization</Heading><Text tone="muted">…</Text></RuledCell>
  </RuledGrid>
</Section>`,
  }),

  // ── Typography ───────────────────────────────────────────────────────────
  item("typography", "components/lsl/typography/typography.jsx", {
    title: "Typography: Heading, Display, Eyebrow, Lead, Text, TextLink",
    category: "typography",
    dependencies: ["@radix-ui/react-slot"],
    purpose: "The type scale as components. Heading level (semantics) and size (looks) are separate.",
    exports: [
      { name: "Heading", props: [p("level", "1 | 2 | 3 | 4 | 5 | 6", "2", "Semantic level. One h1 per page; never skip levels (T2)."), p("size", "'display' | 1 | 2 | 3 | 4", "matches level", "Visual size."), CLASS] },
      { name: "Display", props: [p("level", "1 | 2", "1", ""), CLASS] },
      { name: "Eyebrow", props: [AS, CLASS] },
      { name: "Lead", props: [AS, CLASS] },
      { name: "Text", props: [AS, p("size", "'body' | 'small' | 'label'", "body", ""), p("tone", "'default' | 'muted' | 'danger'", "default", "muted = ink-2 (passes AA)."), CLASS] },
      { name: "TextLink", props: [p("asChild", "boolean", "false", "Wrap a router <Link>."), CLASS] },
    ],
    useWhen: ["All text. Prefer these over raw classes so levels and sizes stay consistent."],
    dontUseWhen: [{ case: "Muted gray text in concrete (#A39B8B)", use: "Text tone=\"muted\" (concrete fails AA, C5)" }],
    rules: ["T1", "T2", "T4", "C5", "W1", "W2"],
    a11y: ["Hero title is the page's only h1.", "A section heading that receives focus from in-page nav needs tabIndex={-1} and data-section-heading."],
    example: `<Eyebrow>Design and technology studio in Oslo</Eyebrow>
<Display>We design and build the digital tools small organizations run on.</Display>
<Lead>We help community organizations and local businesses …</Lead>
<Text tone="muted">Read the <TextLink href="/work/osf-hub">OSF HUB case</TextLink>.</Text>`,
  }),

  // ── Actions ──────────────────────────────────────────────────────────────
  item("icon-button", "components/lsl/actions/icon-button.jsx", {
    title: "IconButton, ButtonGroup",
    category: "actions",
    registryDependencies: ["@lsl/button"],
    purpose: "An icon-only button with a required accessible label, and a row of buttons.",
    exports: [
      { name: "IconButton", props: [p("label", "string", "", "Accessible name and tooltip.", true), p("variant", "Button variant", "outline", "")] },
      { name: "ButtonGroup", props: [p("attached", "boolean", "false", "Join buttons into one ruled bar."), CLASS] },
    ],
    useWhen: ["Toolbar actions, menu toggles, close buttons.", "Primary + secondary action pairs (ButtonGroup)."],
    dontUseWhen: [{ case: "An action people need to discover", use: "Button with a text label" }],
    rules: ["A3", "A7", "S3"],
    a11y: ["Lucide icons inside must have aria-hidden=\"true\"."],
    example: `<IconButton label="Open menu"><Menu aria-hidden="true" /></IconButton>
<ButtonGroup><Button variant="accent">Start a project</Button><Button variant="outline">See the work</Button></ButtonGroup>`,
  }),

  // ── Forms ────────────────────────────────────────────────────────────────
  item("field", "components/lsl/forms/field.jsx", {
    title: "Field, FieldError, FormAlert, FormSuccess, Honeypot",
    category: "forms",
    registryDependencies: ["@lsl/label", "@lsl/status-icon", "@lsl/field-context"],
    purpose: "Wires label, hint, error and character count to a control, plus form-level error, success and anti-bot pieces.",
    exports: [
      { name: "Field", props: [p("label", "node", "", "Visible label.", true), p("hint", "node", "", "Help text under the label."), p("error", "string", "", "Error message; sets aria-invalid."), p("required", "boolean", "false", "Adds * and aria-required."), p("optional", "boolean", "false", "Adds \"(optional)\"."), p("id", "string", "auto", ""), p("count", "number", "", "Current length, for the counter."), p("maxLength", "number", "", "Shows a counter."), p("children", "element", "", "Exactly one control: Input, Textarea or SelectTrigger wrapper.", true), CLASS] },
      { name: "FieldError", props: [p("id", "string", "", ""), p("message", "string", "", ""), CLASS] },
      { name: "FormAlert", props: [p("tone", "'error' | 'success' | 'info'", "error", ""), p("title", "node", "", ""), p("children", "node", "", ""), CLASS] },
      { name: "FormSuccess", props: [p("title", "node", "", "Focused on mount.", true), p("children", "node", "", ""), p("action", "node", "", "E.g. \"Send another message\"."), CLASS] },
      { name: "Honeypot", props: [p("name", "string", "website", "Field name; spread register(name) on it.")] },
    ],
    useWhen: ["Every form control.", "Form-level errors (FormAlert) and success (FormSuccess)."],
    dontUseWhen: [{ case: "Bare Input with a placeholder as the label", use: "Field with a visible label (A5)" }],
    rules: ["A5", "S3", "W1", "W3"],
    a11y: ["On submit errors, focus the first invalid field (react-hook-form shouldFocusError does this).", "On server errors, focus the FormAlert. Keep the user's text.", "Error copy says what to do: \"Please add your email, so we can reply.\""],
    example: `<form noValidate onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-7">
  {failed && <FormAlert ref={alertRef} title="Your message was not sent.">Your text is still here. Try again, or email us.</FormAlert>}
  <Field label="Name" required error={errors.name?.message}>
    <Input autoComplete="name" {...register("name")} />
  </Field>
  <Honeypot {...register("website")} />
</form>`,
  }),
  item("radio-tiles", "components/lsl/forms/radio-tiles.jsx", {
    title: "RadioTiles",
    category: "forms",
    dependencies: ["@radix-ui/react-radio-group"],
    registryDependencies: ["@lsl/field"],
    purpose: "Two to four options drawn as ruled tiles with a hint each. The selected tile inverts to ink.",
    exports: [
      {
        name: "RadioTiles",
        props: [
          p("legend", "node", "", "Question shown above the tiles.", true),
          p("options", "{ value, label?, hint? }[]", "", "", true),
          p("value", "string", "", "Controlled value."),
          p("onValueChange", "(value) => void", "", ""),
          p("onBlur", "() => void", "", ""),
          p("error", "string", "", ""),
          p("required", "boolean", "false", ""),
          p("name", "string", "", ""),
          CLASS,
        ],
      },
    ],
    useWhen: ["\"What is this about?\" style choices with short explanations."],
    dontUseWhen: [{ case: "Five or more options", use: "Select" }],
    rules: ["S2", "A5"],
    a11y: ["Arrow keys move between tiles (Radix).", "With react-hook-form, use a Controller."],
    example: `<Controller name="reason" control={control} render={({ field }) => (
  <RadioTiles legend="What is this about?" required error={errors.reason?.message}
    value={field.value} onValueChange={field.onChange} onBlur={field.onBlur}
    options={[{ value: "New project", hint: "You have something to build." }, { value: "Collaboration" }, { value: "General question" }]} />
)} />`,
  }),

  // ── Navigation ───────────────────────────────────────────────────────────
  item("site-header", "components/lsl/navigation/site-header.jsx", {
    title: "SiteHeader",
    category: "navigation",
    layer: "L3",
    dependencies: ["react-router-dom", "lucide-react"],
    registryDependencies: ["@lsl/mark", "@lsl/glyph", "@lsl/button", "@lsl/sheet", "@lsl/section-nav"],
    purpose: "Sticky site header: logo, section or page links with the butter active underline, a plain CTA, and a full-height mobile menu.",
    exports: [
      {
        name: "SiteHeader",
        props: [
          p("items", "{ label, id? , href? }[]", "[]", "id = section on the home page; href = another page."),
          p("cta", "{ label, href, id? }", "", "Shown as a default (ink) button. Never accent: the page's accent CTA lives in the content (C1)."),
          p("homePath", "string", "/", ""),
          p("showLegend", "boolean", "true", "Show the marks legend in the mobile menu."),
          CLASS,
        ],
      },
    ],
    useWhen: ["Every marketing site and case-study page."],
    dontUseWhen: [{ case: "Product / app screens", use: "AppShell (phase 3)" }],
    rules: ["C1", "A3", "A6", "A7"],
    a11y: ["Active section uses aria-current=\"location\"; active page aria-current=\"page\".", "Mobile menu traps focus and closes with Escape."],
    setup: [
      "Needs react-router: render inside <BrowserRouter> (Base44 apps already have one in App.jsx).",
      "For section items ({ id }): put the id on the <Section>, and give that section's heading tabIndex={-1} and data-section-heading so focus lands on it after the jump.",
    ],
    example: `<SiteHeader
  items={[{ id: "what-we-do", label: "What we do" }, { id: "work", label: "Work" }, { id: "about", label: "About" }]}
  cta={{ label: "Contact", href: "/#contact", id: "contact" }}
/>`,
  }),
  item("site-footer", "components/lsl/navigation/site-footer.jsx", {
    title: "SiteFooter",
    category: "navigation",
    layer: "L3",
    dependencies: ["react-router-dom"],
    registryDependencies: ["@lsl/mark", "@lsl/glyph"],
    purpose: "Footer on paper-alt with logo, tagline, email, site links and the marks legend. Needs react-router (inside <BrowserRouter>).",
    exports: [
      {
        name: "SiteFooter",
        props: [
          p("tagline", "string", "Design and technology studio. Oslo, Norway.", ""),
          p("email", "string", "", ""),
          p("links", "{ label, href }[]", "[]", ""),
          p("showLegend", "boolean", "true", ""),
          p("note", "string", "Built by us, with the same process we use for clients.", "Right side of the bottom line; pass null to hide."),
          CLASS,
        ],
      },
    ],
    useWhen: ["Every marketing site page."],
    dontUseWhen: [],
    rules: ["W3", "W4"],
    a11y: ["Footer nav is labelled \"Footer\"."],
    example: `<SiteFooter email="hello@loystudiolab.com" links={[{ label: "Work", href: "/#work" }]} />`,
  }),
  item("site-shell", "components/lsl/navigation/site-shell.jsx", {
    title: "SiteShell, SkipLink",
    category: "navigation",
    layer: "L3",
    purpose: "Page frame with landmarks: skip link, header, <main id=\"main\">, footer.",
    exports: [
      { name: "SiteShell", props: [p("header", "node", "", "Usually <SiteHeader />."), p("footer", "node", "", "Usually <SiteFooter />."), p("children", "node", "", "Page content or <Outlet />."), CLASS] },
      { name: "SkipLink", props: [p("href", "string", "#main", ""), p("children", "node", "Skip to content", "")] },
    ],
    useWhen: ["As the layout route of every site."],
    dontUseWhen: [],
    rules: ["A6"],
    a11y: ["Provides the skip link and the main landmark; do not add a second <main>."],
    example: `<Route element={<SiteShell header={<SiteHeader … />} footer={<SiteFooter … />}><Outlet /></SiteShell>}>`,
  }),
  item("breadcrumbs", "components/lsl/navigation/breadcrumbs.jsx", {
    title: "Breadcrumbs, NavLink",
    category: "navigation",
    dependencies: ["react-router-dom"],
    purpose: "Where-am-I trail for nested pages, and a standalone nav link with the butter active underline. Needs react-router.",
    exports: [
      { name: "Breadcrumbs", props: [p("items", "{ label, href }[]", "", "Last item is the current page.", true), CLASS] },
      { name: "NavLink", props: [p("to", "string", "", "", true), p("active", "boolean", "false", "Sets aria-current=\"page\" and shows the underline."), CLASS] },
    ],
    useWhen: ["Case-study and article pages (Breadcrumbs).", "Custom navs outside SiteHeader (NavLink)."],
    dontUseWhen: [{ case: "One-level sites", use: "Nothing; the header is enough" }],
    rules: ["A3"],
    a11y: ["Breadcrumbs is a labelled nav with an ordered list."],
    example: `<Breadcrumbs items={[{ label: "Work", href: "/#work" }, { label: "OSF HUB" }]} />`,
  }),

  // ── Data display ─────────────────────────────────────────────────────────
  item("data-display", "components/lsl/data-display/data-display.jsx", {
    title: "TopRuleCard, MetaList, StatusBadge, Avatar",
    category: "data-display",
    registryDependencies: ["@lsl/badge", "@lsl/status-icon"],
    purpose: "Small display patterns: parallel items with a top rule, term/detail lists, workflow status, square avatars.",
    exports: [
      { name: "TopRuleCard", props: [p("title", "node", "", "", true), p("as", "'h2' | 'h3' | 'h4'", "h3", "Heading element."), p("bar", "'ink' | 'brick' | 'ochre' | 'petrol' | 'concrete'", "ink", "Rule color. Values cards may use the muted palette; never butter (C2)."), p("children", "node", "", ""), CLASS] },
      { name: "MetaList", props: [p("items", "{ term, detail }[]", "", "", true), p("cols", "1 | 2 | 3", "2", ""), CLASS] },
      { name: "StatusBadge", props: [p("status", "'draft' | 'active' | 'done' | 'paused' | 'error' | 'ai'", "draft", "ai is only for AI-generated content (C4)."), p("children", "node", "status label", "Override the label."), CLASS] },
      { name: "Avatar", props: [p("src", "string", "", ""), p("name", "string", "", "Alt text and initials source."), p("initials", "string", "", ""), p("size", "'sm' | 'md' | 'lg'", "md", ""), CLASS] },
    ],
    useWhen: ["Services or values in a row (TopRuleCard).", "Case facts (MetaList).", "Lists of things with a state (StatusBadge).", "People in products (Avatar)."],
    dontUseWhen: [{ case: "Founders", use: "FounderMonogram" }, { case: "Loy / Studio / Lab", use: "LayerTag" }],
    rules: ["S2", "S3", "C2", "C4"],
    a11y: ["StatusBadge always shows text; the icon is decorative."],
    example: `<TopRuleCard title="Digitalization">One real system instead of spreadsheets, chat threads and paper.</TopRuleCard>
<MetaList items={[{ term: "Client", detail: "Oslo Skateboardforening" }, { term: "Status", detail: "In use" }]} />
<StatusBadge status="done" />`,
  }),

  // ── Feedback ─────────────────────────────────────────────────────────────
  item("status-icon", "components/lsl/feedback/status-icon.jsx", {
    title: "StatusIcon",
    category: "feedback",
    purpose: "Square-framed status marks: info, success, warning, error, pending.",
    exports: [{ name: "StatusIcon", props: [p("status", "'info' | 'success' | 'warning' | 'error' | 'pending'", "info", ""), p("size", "number", "16", ""), p("label", "string", "", "Accessible name, only when the icon stands alone."), CLASS] }],
    useWhen: ["Anywhere a status needs a mark."],
    dontUseWhen: [{ case: "lucide CircleCheck, AlertTriangle, Info, XCircle", use: "StatusIcon (S3)" }],
    rules: ["S3"],
    a11y: ["Decorative by default; meaning must also be in text."],
    example: `<StatusIcon status="success" />`,
  }),
  item("feedback", "components/lsl/feedback/feedback.jsx", {
    title: "Callout, LinearLoader, EmptyState, ErrorState, NotFound",
    category: "feedback",
    registryDependencies: ["@lsl/status-icon"],
    purpose: "Inline messages, progress, and the empty, error and not-found states.",
    exports: [
      { name: "Callout", props: [p("tone", "'info' | 'success' | 'warning' | 'error'", "info", ""), p("title", "node", "", ""), p("children", "node", "", ""), CLASS] },
      { name: "LinearLoader", props: [p("value", "number (0-100)", "", "Omit for indeterminate."), p("label", "string", "Loading", "Accessible name."), CLASS] },
      { name: "EmptyState", props: [p("title", "node", "Nothing here yet", ""), p("children", "node", "", "What this area is for and how to fill it."), p("action", "node", "", "Usually a Button."), p("headingLevel", "number", "2", ""), CLASS] },
      { name: "ErrorState", props: [p("title", "node", "Something went wrong", ""), p("children", "node", "It is on our side. Please try again.", ""), p("action", "node", "", "Retry button."), p("headingLevel", "number", "2", ""), CLASS] },
      { name: "NotFound", props: [p("title", "node", "This page does not exist", ""), p("children", "node", "The link may be old, or the address has a typo.", ""), p("action", "node", "", ""), CLASS] },
    ],
    useWhen: ["Persistent notes in content (Callout).", "Uploads and long loads (LinearLoader).", "First use and no-results (EmptyState); failed loads (ErrorState); 404 routes (NotFound)."],
    dontUseWhen: [{ case: "A ring spinner", use: "LinearLoader (S2)" }, { case: "Transient confirmations", use: "Toaster" }],
    rules: ["S2", "S3", "A4", "W1", "W3"],
    a11y: ["ErrorState has role=\"alert\".", "LinearLoader is a labelled progressbar."],
    example: `<Callout tone="warning" title="Prices exclude VAT">We add 25% MVA on the invoice.</Callout>
<LinearLoader value={60} label="Uploading receipt" />
<EmptyState title="No receipts yet" action={<Button>Add a receipt</Button>}>Photos of receipts you add will show up here.</EmptyState>`,
  }),

  // ── Motion ───────────────────────────────────────────────────────────────
  item("reveal", "components/lsl/motion/reveal.jsx", {
    title: "Reveal, Rise",
    category: "motion",
    purpose: "The two motion primitives: a fail-safe scroll reveal and a one-time hero entrance. CSS only.",
    exports: [
      { name: "Reveal", props: [AS, p("delay", "number (s)", "0", "Stagger siblings by 0.06 to 0.1s."), CLASS] },
      { name: "Rise", props: [AS, p("delay", "number (s)", "0", ""), CLASS] },
    ],
    useWhen: ["Section content as it scrolls in (Reveal).", "Hero text on load (Rise)."],
    dontUseWhen: [{ case: "Looping or decorative motion", use: "Nothing (M1)" }, { case: "framer-motion", use: "These CSS primitives (M2)" }],
    rules: ["M1", "M2", "M3", "A4"],
    a11y: ["Content stays visible if observers never run; reduced motion shows it at once."],
    example: `<Reveal><Heading level={2}>How we work</Heading></Reveal>
<Rise delay={0.1}><Lead>…</Lead></Rise>`,
  }),

  // ── Hooks and lib ────────────────────────────────────────────────────────
  item("section-nav", "hooks/use-section-nav.js", {
    title: "useGoToSection, useActiveSection",
    category: "hooks",
    layer: "L0",
    purpose: "In-page navigation: smooth jump that moves focus to the section heading, and active-section tracking for the header.",
    exports: [
      { name: "useGoToSection", kind: "hook", props: [p("enabled", "boolean", "true", "False on pages where the targets are not rendered.")] },
      { name: "useActiveSection", kind: "hook", props: [p("ids", "string[]", "", "", true), p("enabled", "boolean", "true", "")] },
    ],
    useWhen: ["One-page sites with section links."],
    dontUseWhen: [],
    rules: ["A3", "A4"],
    a11y: ["Respects reduced motion (instant jump)."],
    example: `const go = useGoToSection()
<a href="#work" onClick={(e) => go("work", e)}>Work</a>`,
  }),
  item("use-document-title", "hooks/use-document-title.js", {
    title: "useDocumentTitle",
    category: "hooks",
    layer: "L0",
    purpose: "Sets the browser title as \"Page · LoyStudioLab\".",
    exports: [{ name: "useDocumentTitle", kind: "hook", props: [p("title", "string", "", ""), p("site", "string", "LoyStudioLab", "")] }],
    useWhen: ["Every routed page."],
    dontUseWhen: [],
    rules: ["A6"],
    a11y: ["Unique titles help screen-reader and tab users."],
    example: `useDocumentTitle("OSF HUB")`,
  }),
  item("use-reduced-motion", "hooks/use-reduced-motion.js", {
    title: "useReducedMotion",
    category: "hooks",
    layer: "L0",
    purpose: "True when the user asked for reduced motion; updates live.",
    exports: [{ name: "useReducedMotion", kind: "hook", props: [] }],
    useWhen: ["JS-driven motion (scrolling, timed changes)."],
    dontUseWhen: [{ case: "CSS animations", use: "Nothing: the preset already disables them" }],
    rules: ["A4"],
    a11y: [],
    example: `const reduced = useReducedMotion()`,
  }),
  item("field-context", "lib/field-context.js", {
    title: "FieldContext",
    category: "hooks",
    layer: "L0",
    purpose: "Lets Field pass its id and aria wiring to controls nested deeper than its direct child (SelectTrigger).",
    exports: [
      { name: "FieldContext", kind: "constant", props: [] },
      { name: "useFieldContext", kind: "hook", props: [] },
    ],
    useWhen: ["Building a new control that should work inside Field without being its direct child."],
    dontUseWhen: [{ case: "Normal forms", use: "Field (it handles this for you)" }],
    rules: ["A5"],
    a11y: ["Spread the context value onto the focusable element."],
    example: `const field = useFieldContext()
<button {...(field ?? {})}>…</button>`,
  }),
  item("format", "lib/format.js", {
    title: "formatNOK, formatNumber, formatDate",
    category: "hooks",
    layer: "L0",
    purpose: "Money, number and date formatting: English copy, Norwegian conventions (2 500 kr, 1 234,5, 11.11.2026).",
    exports: [
      { name: "formatNOK", kind: "function", props: [p("amount", "number", "", "", true), p("options", "{ decimals?, locale? }", "{ decimals: 0, locale: 'nb-NO' }", "")] },
      { name: "formatNumber", kind: "function", props: [p("value", "number", "", "", true), p("options", "{ decimals?, locale? }", "", "")] },
      { name: "formatDate", kind: "function", props: [p("value", "Date | string", "", "", true), p("options", "{ style?: 'long' | 'short' | 'numeric', locale? }", "{ style: 'long', locale: 'en-GB' }", "")] },
    ],
    useWhen: ["Any amount or date shown to people."],
    dontUseWhen: [{ case: "toFixed or manual string building", use: "These helpers" }],
    rules: ["W1"],
    a11y: [],
    example: `formatNOK(2500) // "2 500 kr"
formatDate("2026-11-11") // "11 November 2026"`,
  }),
]
