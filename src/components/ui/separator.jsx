// @lsl/separator · managed by loystudiolab-ui · change upstream, not here.
import * as React from "react"
import * as SeparatorPrimitive from "@radix-ui/react-separator"

import { cn } from "@/lib/utils"

// `strong` (2px, follows the surface's line color) separates meaningful regions.
// `subtle` (rule color) is decoration only (rule G2).
const Separator = React.forwardRef(
  ({ className, orientation = "horizontal", decorative = true, tone = "strong", ...props }, ref) => (
    <SeparatorPrimitive.Root
      ref={ref}
      decorative={decorative}
      orientation={orientation}
      className={cn(
        "shrink-0",
        tone === "subtle" ? "bg-divider" : "bg-line",
        orientation === "horizontal" ? "h-[2px] w-full" : "h-full w-[2px]",
        className
      )}
      {...props}
    />
  )
)
Separator.displayName = SeparatorPrimitive.Root.displayName

export { Separator }
