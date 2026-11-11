// @lsl/badge · managed by loystudiolab-ui · change upstream, not here.
import * as React from "react"
import { cva } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center gap-2 border-2 px-2.5 py-1 font-body text-xs font-semibold uppercase leading-none tracking-[0.08em]",
  {
    variants: {
      variant: {
        default: "border-line bg-surface text-fg",
        solid: "border-fg bg-fg text-surface",
        danger: "border-danger bg-surface text-danger",
        // Signal: only for AI or computing states (rule C4).
        signal: "border-signal bg-surface text-signal-fg",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({ className, variant, ...props }) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
