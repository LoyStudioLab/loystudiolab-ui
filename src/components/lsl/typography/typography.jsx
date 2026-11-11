// @lsl/typography · managed by loystudiolab-ui · change upstream, not here.
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"

import { cn } from "@/lib/utils"

/*
  Heading level is semantic and sequential; visual size is separate (rule T2).
  Jost for display and headings, Archivo for everything else (rule T1).
*/
const SIZE = { display: "display-1", 1: "heading-1", 2: "heading-2", 3: "heading-3", 4: "font-display text-lg font-semibold leading-snug" }
const DEFAULT_SIZE = { 1: 1, 2: 2, 3: 3, 4: 4, 5: 4, 6: 4 }

export const Heading = React.forwardRef(function Heading({ level = 2, size, className, ...props }, ref) {
  const Tag = `h${level}`
  const s = size ?? DEFAULT_SIZE[level]
  return <Tag ref={ref} className={cn(SIZE[s], (s === 1 || s === 2) && "max-w-[24ch]", "text-fg", className)} {...props} />
})

export const Display = React.forwardRef(function Display({ level = 1, className, ...props }, ref) {
  return <Heading ref={ref} level={level} size="display" className={cn("max-w-[18ch]", className)} {...props} />
})

export function Eyebrow({ as: Tag = "p", className, ...props }) {
  return <Tag className={cn("eyebrow", className)} {...props} />
}

export function Lead({ as: Tag = "p", className, ...props }) {
  return <Tag className={cn("lead max-w-prose", className)} {...props} />
}

const TEXT_SIZE = { body: "text-base leading-[1.6]", small: "text-sm leading-normal", label: "label-caps" }
const TEXT_TONE = { default: "text-fg", muted: "text-fg-2", danger: "text-danger" }

export function Text({ as: Tag = "p", size = "body", tone = "default", className, ...props }) {
  return <Tag className={cn(TEXT_SIZE[size], TEXT_TONE[tone], className)} {...props} />
}

// Inline text link: ink with a butter underline that thickens on hover.
// Use asChild to wrap a router <Link>.
export const TextLink = React.forwardRef(function TextLink({ asChild = false, className, ...props }, ref) {
  const Comp = asChild ? Slot : "a"
  return <Comp ref={ref} className={cn("link-u", className)} {...props} />
})
