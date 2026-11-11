// @lsl/glyph · managed by loystudiolab-ui · change upstream, not here.
import { cn } from "@/lib/utils"

/*
  The three layer marks, the only place circle, square and triangle appear in UI
  (rule S1). Solid circle = Loy (petrol, rule C3). Solid butter square = Studio.
  Outline-only triangle = Lab.
*/
export const LAYERS = {
  loy: { name: "Loy", short: "The two of us", line: "Mariana and Ramón. Design, systems and code under one roof." },
  studio: { name: "Studio", short: "Work with clients", line: "Your organization, your problem, solved properly and handed over." },
  lab: { name: "Lab", short: "Our own experiments", line: "Tools we build for problems we hit ourselves. Still open, still changing." },
}

export function Glyph({ layer, size = 14, className }) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 16 16",
    "aria-hidden": true,
    focusable: "false",
    className: cn("shrink-0", className),
  }
  if (layer === "loy") {
    return (
      <svg {...common}>
        <circle cx="8" cy="8" r="7" fill="rgb(var(--lsl-loy))" />
      </svg>
    )
  }
  if (layer === "studio") {
    return (
      <svg {...common}>
        <rect x="1" y="1" width="14" height="14" fill="rgb(var(--lsl-butter))" stroke="rgb(var(--lsl-fg))" strokeWidth="2" />
      </svg>
    )
  }
  if (layer === "lab") {
    return (
      <svg {...common}>
        <polygon points="8,1.8 14.8,14.6 1.2,14.6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="miter" />
      </svg>
    )
  }
  return null
}

export function LayerTag({ layer, children, className }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 border-2 bg-surface px-2.5 py-1 font-body text-xs font-semibold uppercase leading-none tracking-[0.08em]",
        layer === "loy" ? "border-loy text-loy" : "border-line text-fg",
        className
      )}
    >
      <Glyph layer={layer} size={11} />
      {children ?? LAYERS[layer]?.name}
    </span>
  )
}

// "How to read our marks": the key to the three shapes.
export function LayerLegend({ layers = LAYERS, detail = "short", className }) {
  return (
    <dl className={cn("space-y-3", className)}>
      {Object.entries(layers).map(([key, l]) => (
        <div key={key} className="flex items-start gap-3">
          <dt className="flex w-24 shrink-0 items-center gap-2 pt-0.5 font-body text-xs font-semibold uppercase tracking-[0.08em]">
            <Glyph layer={key} size={12} />
            {l.name}
          </dt>
          <dd className="text-sm text-fg-2">{detail === "line" ? l.line : l.short}</dd>
        </div>
      ))}
    </dl>
  )
}

// Founder monogram: a solid Loy circle with initials. The only round "avatar" in the
// system, because founders are the Loy layer. Everyone else gets a square Avatar.
export function FounderMonogram({ initials, name, size = 56, className }) {
  return (
    <svg
      viewBox="0 0 56 56"
      width={size}
      height={size}
      className={cn("shrink-0", className)}
      role={name ? "img" : undefined}
      aria-label={name}
      aria-hidden={name ? undefined : true}
      focusable="false"
    >
      <circle cx="28" cy="28" r="28" fill="rgb(var(--lsl-loy))" />
      <text
        x="28"
        y="29"
        textAnchor="middle"
        dominantBaseline="middle"
        fontFamily="var(--lsl-font-display)"
        fontWeight="600"
        fontSize="20"
        letterSpacing="1"
        fill="rgb(var(--lsl-surface))"
      >
        {initials}
      </text>
    </svg>
  )
}
