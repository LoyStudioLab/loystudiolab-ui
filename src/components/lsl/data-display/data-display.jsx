// @lsl/data-display · managed by loystudiolab-ui · change upstream, not here.
import { Badge } from "@/components/ui/badge"
import { StatusIcon } from "@/components/lsl/feedback/status-icon"
import { cn } from "@/lib/utils"

/*
  Card with a thick colored rule on top, for parallel items (services, values).
  `bar` picks the rule color from the muted palette. Butter is not a bar color (C2).
*/
const BAR = { ink: "border-t-ink", brick: "border-t-brick", ochre: "border-t-ochre", petrol: "border-t-petrol", concrete: "border-t-concrete" }

export function TopRuleCard({ title, as: Heading = "h3", bar = "ink", children, className }) {
  return (
    <div className={cn("flex flex-col gap-3 border-t-[6px] pt-5", BAR[bar], className)}>
      <Heading className="heading-3">{title}</Heading>
      {children && <div className="text-fg-2">{children}</div>}
    </div>
  )
}

// Term and detail pairs, e.g. Client / Status / Year. items: [{ term, detail }]
export function MetaList({ items, cols = 2, className }) {
  return (
    <dl className={cn("grid gap-4 text-sm", cols === 3 ? "grid-cols-2 sm:grid-cols-3" : cols === 1 ? "grid-cols-1" : "grid-cols-2", className)}>
      {items.map((it) => (
        <div key={it.term}>
          <dt className="label-caps text-fg-2">{it.term}</dt>
          <dd className="mt-1 font-medium text-fg">{it.detail}</dd>
        </div>
      ))}
    </dl>
  )
}

/*
  Status as text plus a square mark, so color is never the only cue.
  status: draft | active | done | paused | error | ai
*/
const STATUS = {
  draft: { icon: "pending", label: "Draft", variant: "default" },
  active: { icon: "info", label: "Active", variant: "default" },
  done: { icon: "success", label: "Done", variant: "solid" },
  paused: { icon: "pending", label: "Paused", variant: "default" },
  error: { icon: "error", label: "Needs attention", variant: "danger" },
  ai: { icon: "info", label: "AI generated", variant: "signal" },
}

export function StatusBadge({ status = "draft", children, className }) {
  const s = STATUS[status] ?? STATUS.draft
  return (
    <Badge variant={s.variant} className={className}>
      <StatusIcon status={s.icon} size={12} />
      {children ?? s.label}
    </Badge>
  )
}

/*
  Square avatar for people in products (rule S2: circles mean Loy). Founders use
  FounderMonogram instead. Shows the image when given, initials otherwise.
*/
const AV_SIZE = { sm: "size-8 text-xs", md: "size-11 text-sm", lg: "size-16 text-lg" }

export function Avatar({ src, name, initials, size = "md", className }) {
  const letters = initials ?? (name ? name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase() : "")
  return (
    <span className={cn("inline-grid shrink-0 place-items-center overflow-hidden border-2 border-line bg-tint font-display font-semibold text-fg", AV_SIZE[size], className)}>
      {src ? <img src={src} alt={name ?? ""} className="size-full object-cover" /> : <span aria-hidden={name ? true : undefined}>{letters}</span>}
      {!src && name && <span className="sr-only">{name}</span>}
    </span>
  )
}
