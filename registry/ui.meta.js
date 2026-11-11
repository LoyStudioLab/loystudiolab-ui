// L1: shadcn/ui primitives restyled to LoyStudioLab. Same names and APIs as shadcn,
// so stock shadcn knowledge applies; only the look and the allowed variants change.
const ui = (name, file, extra) => ({
  name,
  category: extra.category ?? "primitives",
  layer: "L1",
  status: "stable",
  type: "registry:ui",
  files: [{ path: `components/ui/${file}`, type: "registry:ui", target: `src/components/ui/${file}` }],
  registryDependencies: ["@lsl/foundation", ...(extra.registryDependencies ?? [])],
  ...extra,
})

const variantProp = (values, def, description) => ({ name: "variant", type: values.map((v) => `'${v}'`).join(" | "), default: def, description })

export default [
  ui("button", "button.jsx", {
    title: "Button",
    category: "actions",
    dependencies: ["@radix-ui/react-slot", "class-variance-authority"],
    purpose: "Trigger an action, or style a link as a button with asChild.",
    exports: [
      {
        name: "Button",
        props: [
          variantProp(["default", "accent", "outline", "ghost", "link", "destructive"], "default", "accent = the page's one highest-priority CTA (C1). default = solid, follows the surface. outline = secondary. ghost = tertiary. destructive = delete or remove."),
          { name: "size", type: "'default' | 'sm' | 'lg' | 'icon'", default: "default", description: "All sizes are at least 44px tall (A7)." },
          { name: "asChild", type: "boolean", default: "false", description: "Render the child (e.g. a router <Link>) with button styles." },
        ],
      },
    ],
    useWhen: ["Any action: submit, open, save, start.", "Primary page CTA: variant=\"accent\", once per page.", "A link that should look like a button: asChild around <Link>."],
    dontUseWhen: [
      { case: "Inline link inside text", use: "TextLink" },
      { case: "Icon-only control", use: "IconButton" },
      { case: "A second accent on the same page", use: "variant default or outline" },
    ],
    rules: ["C1", "C2", "A2", "A7", "W1"],
    a11y: ["Busy state: set disabled and aria-busy while sending.", "Label is the visible text; keep it a verb phrase (\"Send message\")."],
    example: `<Button variant="accent" size="lg">Send message</Button>
<Button variant="outline">See the work</Button>
<Button asChild><Link to="/contact">Contact</Link></Button>`,
  }),
  ui("input", "input.jsx", {
    title: "Input",
    category: "forms",
    dependencies: [],
    purpose: "Single-line text entry. Always inside a Field.",
    exports: [{ name: "Input", props: [{ name: "type", type: "string", default: "text", description: "Native input type. Use type, inputMode and autoComplete for good mobile keyboards." }] }],
    useWhen: ["Names, emails, short answers."],
    dontUseWhen: [{ case: "More than one line", use: "Textarea" }, { case: "Choosing from a list", use: "Select or RadioTiles" }],
    rules: ["A5", "G2"],
    a11y: ["Wrap in Field so label, hint and error are wired.", "aria-invalid turns the border to the danger color."],
    example: `<Field label="Email" required error={errors.email?.message}>
  <Input type="email" autoComplete="email" {...register("email")} />
</Field>`,
  }),
  ui("textarea", "textarea.jsx", {
    title: "Textarea",
    category: "forms",
    dependencies: [],
    purpose: "Multi-line text entry. Always inside a Field; pass maxLength and count to Field for a counter.",
    exports: [{ name: "Textarea", props: [] }],
    useWhen: ["Messages, descriptions, notes."],
    dontUseWhen: [{ case: "One line", use: "Input" }],
    rules: ["A5"],
    a11y: ["Field links the character count with aria-describedby."],
    example: `<Field label="Message" required maxLength={2000} count={message.length}>
  <Textarea rows={6} {...register("message")} />
</Field>`,
  }),
  ui("label", "label.jsx", {
    title: "Label",
    category: "forms",
    dependencies: ["@radix-ui/react-label", "class-variance-authority"],
    purpose: "Uppercase UI label for a control. Field renders it for you.",
    exports: [{ name: "Label", props: [] }],
    useWhen: ["Only when building a control outside Field."],
    dontUseWhen: [{ case: "Normal form fields", use: "Field" }],
    rules: ["A5", "T1"],
    a11y: ["Always set htmlFor."],
    example: `<Label htmlFor="q">Search</Label>`,
  }),
  ui("select", "select.jsx", {
    title: "Select",
    category: "forms",
    dependencies: ["@radix-ui/react-select", "lucide-react"],
    registryDependencies: ["@lsl/field-context"],
    purpose: "Choose one option from a list of five or more.",
    exports: [
      { name: "Select", props: [] },
      { name: "SelectTrigger", props: [] },
      { name: "SelectValue", props: [] },
      { name: "SelectContent", props: [{ name: "position", type: "'popper' | 'item-aligned'", default: "popper", description: "Radix positioning mode." }] },
      { name: "SelectItem", props: [] },
      { name: "SelectGroup", props: [] },
      { name: "SelectLabel", props: [] },
      { name: "SelectSeparator", props: [] },
    ],
    useWhen: ["Five or more options, or options that do not need explanation."],
    dontUseWhen: [{ case: "Two to four options with hints", use: "RadioTiles" }],
    rules: ["A3", "A5", "G3"],
    a11y: ["Wrap <Select> in Field: SelectTrigger reads the Field's id and aria wiring through FieldContext, so the label and errors apply."],
    example: `<Field label="Topic">
  <Select onValueChange={setTopic}>
    <SelectTrigger><SelectValue placeholder="Choose a topic" /></SelectTrigger>
    <SelectContent>
      <SelectItem value="web">Website</SelectItem>
      <SelectItem value="app">App or internal tool</SelectItem>
    </SelectContent>
  </Select>
</Field>`,
  }),
  ui("checkbox", "checkbox.jsx", {
    title: "Checkbox",
    category: "forms",
    dependencies: ["@radix-ui/react-checkbox", "lucide-react"],
    purpose: "A yes or no choice, or several independent choices.",
    exports: [{ name: "Checkbox", props: [] }],
    useWhen: ["Consent, opt-ins, multi-select lists."],
    dontUseWhen: [{ case: "A setting that applies immediately", use: "Switch" }],
    rules: ["S2", "A5"],
    a11y: ["Pair with a <Label htmlFor> next to it; the label is the click target."],
    example: `<div className="flex items-center gap-3">
  <Checkbox id="news" />
  <Label htmlFor="news" className="normal-case tracking-normal text-base font-normal">Send me the occasional update</Label>
</div>`,
  }),
  ui("radio-group", "radio-group.jsx", {
    title: "RadioGroup",
    category: "forms",
    dependencies: ["@radix-ui/react-radio-group"],
    purpose: "One choice from a short list, as square radios (circles mean Loy, rule S2).",
    exports: [{ name: "RadioGroup", props: [] }, { name: "RadioGroupItem", props: [] }],
    useWhen: ["Compact one-of-many choice in dense forms."],
    dontUseWhen: [{ case: "Two to four options that need hints", use: "RadioTiles" }],
    rules: ["S2", "A5"],
    a11y: ["Give the group aria-labelledby pointing at a visible legend."],
    example: `<RadioGroup defaultValue="email" aria-label="Reply by">
  <div className="flex items-center gap-3"><RadioGroupItem value="email" id="r1" /><Label htmlFor="r1">Email</Label></div>
  <div className="flex items-center gap-3"><RadioGroupItem value="phone" id="r2" /><Label htmlFor="r2">Phone</Label></div>
</RadioGroup>`,
  }),
  ui("switch", "switch.jsx", {
    title: "Switch",
    category: "forms",
    dependencies: ["@radix-ui/react-switch"],
    purpose: "Turn a setting on or off, applied immediately.",
    exports: [{ name: "Switch", props: [] }],
    useWhen: ["Settings that take effect at once."],
    dontUseWhen: [{ case: "A choice submitted with a form", use: "Checkbox" }],
    rules: ["G1", "A5"],
    a11y: ["Needs a label via <Label htmlFor> or aria-label."],
    example: `<div className="flex items-center gap-3"><Switch id="notify" /><Label htmlFor="notify">Notifications</Label></div>`,
  }),
  ui("badge", "badge.jsx", {
    title: "Badge",
    category: "data-display",
    dependencies: ["class-variance-authority"],
    purpose: "A short uppercase tag: category, count, state.",
    exports: [{ name: "Badge", props: [variantProp(["default", "solid", "danger", "signal"], "default", "signal is only for AI or computing states (C4).")] }],
    useWhen: ["Categories, short states, counts."],
    dontUseWhen: [{ case: "Loy / Studio / Lab", use: "LayerTag" }, { case: "A workflow status", use: "StatusBadge" }],
    rules: ["C4", "S1"],
    a11y: ["Text must carry the meaning; color is never the only cue."],
    example: `<Badge>Case study</Badge> <Badge variant="solid">New</Badge>`,
  }),
  ui("card", "card.jsx", {
    title: "Card",
    category: "data-display",
    dependencies: [],
    purpose: "A flat 2px-ruled container for one item: a case, a person, a setting group.",
    exports: [
      { name: "Card", props: [] },
      { name: "CardHeader", props: [] },
      { name: "CardTitle", props: [{ name: "as", type: "'h2' | 'h3' | 'h4'", default: "h3", description: "Heading level; keep levels sequential (T2)." }] },
      { name: "CardDescription", props: [] },
      { name: "CardContent", props: [] },
      { name: "CardFooter", props: [] },
    ],
    useWhen: ["Separate, clickable or self-contained items."],
    dontUseWhen: [{ case: "A set of parallel items in one block", use: "RuledGrid (shared rules) or TopRuleCard" }],
    rules: ["G1", "G2", "G3", "T2"],
    a11y: ["If the whole card is a link, put the <a> on the title and stretch it (after:absolute after:inset-0)."],
    example: `<Card>
  <CardHeader>
    <CardTitle>Oslo Skatehall</CardTitle>
    <CardDescription>An operations system for a community-run skatepark.</CardDescription>
  </CardHeader>
</Card>`,
  }),
  ui("sheet", "sheet.jsx", {
    title: "Sheet",
    category: "overlays",
    dependencies: ["@radix-ui/react-dialog", "class-variance-authority", "lucide-react"],
    purpose: "A panel that slides in from an edge: mobile menu, filters, details.",
    exports: [
      { name: "Sheet", props: [] },
      { name: "SheetTrigger", props: [] },
      { name: "SheetContent", props: [{ name: "side", type: "'top' | 'right' | 'bottom' | 'left'", default: "right", description: "" }, { name: "closeLabel", type: "string", default: "Close", description: "Accessible name of the close button." }] },
      { name: "SheetHeader", props: [] },
      { name: "SheetTitle", props: [] },
      { name: "SheetDescription", props: [] },
      { name: "SheetFooter", props: [] },
      { name: "SheetClose", props: [] },
    ],
    useWhen: ["Mobile navigation (SiteHeader uses it).", "Secondary panels that keep the page visible behind them."],
    dontUseWhen: [{ case: "A blocking question", use: "AlertDialog (phase 3)" }],
    rules: ["G3", "A3"],
    a11y: ["Always render a SheetTitle (visually hidden is fine). Focus is trapped and Escape closes."],
    example: `<Sheet>
  <SheetTrigger asChild><Button variant="outline">Filters</Button></SheetTrigger>
  <SheetContent side="right">
    <SheetHeader><SheetTitle>Filters</SheetTitle></SheetHeader>
  </SheetContent>
</Sheet>`,
  }),
  ui("separator", "separator.jsx", {
    title: "Separator",
    category: "layout",
    dependencies: ["@radix-ui/react-separator"],
    purpose: "A 2px rule between regions.",
    exports: [{ name: "Separator", props: [{ name: "orientation", type: "'horizontal' | 'vertical'", default: "horizontal", description: "" }, { name: "decorative", type: "boolean", default: "true", description: "" }, { name: "tone", type: "'strong' | 'subtle'", default: "strong", description: "subtle is decoration only (G2)." }] }],
    useWhen: ["Between groups in a panel or list."],
    dontUseWhen: [{ case: "Between page bands", use: "Section (has its own top border)" }],
    rules: ["G2"],
    a11y: [],
    example: `<Separator />`,
  }),
  ui("sonner", "sonner.jsx", {
    title: "Toaster",
    category: "feedback",
    dependencies: ["sonner"],
    registryDependencies: ["@lsl/status-icon"],
    purpose: "Short, transient confirmation messages (toast). Mount <Toaster /> once.",
    exports: [{ name: "Toaster", props: [] }],
    useWhen: ["Confirming a background action: saved, copied, sent."],
    dontUseWhen: [{ case: "Errors the user must fix", use: "FieldError or FormAlert" }, { case: "Persistent information", use: "Callout" }],
    rules: ["S3", "G3"],
    a11y: ["Toasts disappear: never put the only copy of important information in one."],
    example: `import { toast } from "sonner"
<Toaster />
toast.success("Saved")`,
  }),
  ui("skeleton", "skeleton.jsx", {
    title: "Skeleton",
    category: "feedback",
    dependencies: [],
    purpose: "Placeholder block while content loads. Pulses opacity, no shimmer.",
    exports: [{ name: "Skeleton", props: [] }],
    useWhen: ["Content with a known shape that loads in under a few seconds."],
    dontUseWhen: [{ case: "Long or unknown waits", use: "LinearLoader with a label" }],
    rules: ["G4", "A4"],
    a11y: ["Hidden from screen readers; announce loading elsewhere (aria-busy on the region)."],
    example: `<Skeleton className="h-6 w-40" />`,
  }),
  ui("tooltip", "tooltip.jsx", {
    title: "Tooltip",
    category: "overlays",
    dependencies: ["@radix-ui/react-tooltip"],
    purpose: "A short hint on hover or focus for an icon or abbreviation.",
    exports: [
      { name: "TooltipProvider", props: [] },
      { name: "Tooltip", props: [] },
      { name: "TooltipTrigger", props: [] },
      { name: "TooltipContent", props: [{ name: "sideOffset", type: "number", default: "6", description: "" }] },
    ],
    useWhen: ["Naming an icon-only control (in addition to its aria-label)."],
    dontUseWhen: [{ case: "Information people need to finish a task", use: "Field hint or Callout" }],
    rules: ["A3"],
    a11y: ["Not reachable on touch: never the only place for important text."],
    example: `<TooltipProvider><Tooltip><TooltipTrigger asChild><IconButton label="Copy link"><Copy /></IconButton></TooltipTrigger><TooltipContent>Copy link</TooltipContent></Tooltip></TooltipProvider>`,
  }),
]
