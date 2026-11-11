// @lsl/icon-button · managed by loystudiolab-ui · change upstream, not here.
import * as React from "react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

// Icon-only button. `label` is required: it becomes the accessible name.
export const IconButton = React.forwardRef(function IconButton({ label, variant = "outline", children, ...props }, ref) {
  if (import.meta.env?.DEV && !label) console.warn("[LSL-A3] IconButton needs a `label` for screen readers.")
  return (
    <Button ref={ref} variant={variant} size="icon" aria-label={label} title={label} {...props}>
      {children}
    </Button>
  )
})

// A row of buttons. `attached` joins them into one ruled bar.
export function ButtonGroup({ attached = false, className, ...props }) {
  return (
    <div
      role="group"
      className={cn(
        "flex",
        attached ? "[&>*+*]:-ml-[2px]" : "flex-wrap gap-3",
        className
      )}
      {...props}
    />
  )
}
