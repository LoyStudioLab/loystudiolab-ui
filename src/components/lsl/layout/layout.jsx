// @lsl/layout · managed by loystudiolab-ui · change upstream, not here.
import * as React from "react"

import { cn } from "@/lib/utils"

/*
  Layout primitives on the base-8 grid (rule G5). Spacing props take grid steps:
  1 = 8px, 2 = 16px, 3 = 24px, 4 = 32px, 6 = 48px, 8 = 64px.
  Class strings are written out in full so Tailwind can see them.
*/
const GAP = { 0: "gap-0", 1: "gap-2", 2: "gap-4", 3: "gap-6", 4: "gap-8", 6: "gap-12", 8: "gap-16" }
const ALIGN = { start: "items-start", center: "items-center", end: "items-end", baseline: "items-baseline", stretch: "items-stretch" }
const JUSTIFY = { start: "justify-start", center: "justify-center", end: "justify-end", between: "justify-between" }

export function Container({ as: Tag = "div", width = "site", className, ...props }) {
  return <Tag className={cn(width === "prose" ? "mx-auto w-full max-w-prose px-4 sm:px-6" : "container-site", className)} {...props} />
}

const SURFACE = { paper: "surface-paper", alt: "surface-alt", ink: "surface-ink" }

const SECTION_SPACE = {
  sm: "py-10 md:py-12",
  md: "py-16 md:py-24",
  lg: "py-20 md:py-32",
}

// A page band. `surface` sets colors for everything inside (paper, alt or ink).
export const Section = React.forwardRef(function Section(
  { as: Tag = "section", surface = "paper", space = "md", bordered = true, contained = true, className, children, ...props },
  ref
) {
  return (
    <Tag ref={ref} className={cn(SURFACE[surface], SECTION_SPACE[space], bordered && "border-t-2 border-ink", className)} {...props}>
      {contained ? <div className="container-site">{children}</div> : children}
    </Tag>
  )
})

export function Stack({ as: Tag = "div", gap = 3, align = "stretch", className, ...props }) {
  return <Tag className={cn("flex flex-col", GAP[gap], ALIGN[align], className)} {...props} />
}

export function Cluster({ as: Tag = "div", gap = 2, align = "center", justify = "start", wrap = true, className, ...props }) {
  return <Tag className={cn("flex", wrap && "flex-wrap", GAP[gap], ALIGN[align], JUSTIFY[justify], className)} {...props} />
}

const COLS = {
  1: "grid-cols-1",
  2: "grid-cols-1 md:grid-cols-2",
  3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
  4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
  6: "grid-cols-2 md:grid-cols-3 lg:grid-cols-6",
  12: "grid-cols-4 md:grid-cols-12",
}

// Responsive grid: collapses to one column on small screens.
export function Grid({ as: Tag = "div", cols = 3, gap = 4, align = "stretch", className, ...props }) {
  return <Tag className={cn("grid", COLS[cols], GAP[gap], ALIGN[align], className)} {...props} />
}

// Exposed grid: cells share 2px rules instead of floating as separate cards.
export function RuledGrid({ as: Tag = "div", cols = 3, className, ...props }) {
  return <Tag className={cn("grid-ruled grid", COLS[cols], className)} {...props} />
}

export function RuledCell({ as: Tag = "div", className, ...props }) {
  return <Tag className={cn("flex flex-col gap-3 p-6 lg:p-8", className)} {...props} />
}

/*
  Title block: an index number and label in a left column, content on the right.
  Like a drawing sheet's title block: the reader always knows where they are.
*/
export function TitleBlock({ index, label, children, className }) {
  return (
    <div className={cn("grid gap-6 lg:grid-cols-12 lg:gap-10", className)}>
      <div className="lg:col-span-3">
        {(index != null || label) && (
          <p className="eyebrow flex items-center gap-3">
            {index != null && (
              <span className="inline-flex h-8 min-w-8 items-center justify-center border-2 border-line px-1.5 font-body text-xs tracking-normal text-fg">
                {index}
              </span>
            )}
            {label}
          </p>
        )}
      </div>
      <div className="lg:col-span-9">{children}</div>
    </div>
  )
}

export function Divider({ tone = "strong", className, ...props }) {
  return <hr className={cn("h-[2px] w-full border-0", tone === "subtle" ? "bg-divider" : "bg-line", className)} {...props} />
}
