// @lsl/switch · managed by loystudiolab-ui · change upstream, not here.
import * as React from "react"
import * as SwitchPrimitives from "@radix-ui/react-switch"

import { cn } from "@/lib/utils"

const Switch = React.forwardRef(({ className, ...props }, ref) => (
  <SwitchPrimitives.Root
    className={cn(
      "peer inline-flex h-7 w-12 shrink-0 cursor-pointer items-center border-2 border-line bg-surface p-0.5 transition-colors duration-fast disabled:cursor-not-allowed disabled:opacity-60 data-[state=checked]:bg-fg",
      className
    )}
    {...props}
    ref={ref}
  >
    <SwitchPrimitives.Thumb className="pointer-events-none block size-5 bg-fg transition-transform duration-fast ease-lsl data-[state=checked]:translate-x-5 data-[state=checked]:bg-surface" />
  </SwitchPrimitives.Root>
))
Switch.displayName = SwitchPrimitives.Root.displayName

export { Switch }
