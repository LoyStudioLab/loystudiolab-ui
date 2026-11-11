// @lsl/checkbox · managed by loystudiolab-ui · change upstream, not here.
import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { Check } from "lucide-react"

import { cn } from "@/lib/utils"

const Checkbox = React.forwardRef(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      "peer grid size-6 shrink-0 place-items-center border-2 border-line bg-surface text-surface transition-colors duration-fast hover:bg-tint disabled:cursor-not-allowed disabled:opacity-60 aria-[invalid=true]:border-danger data-[state=checked]:bg-fg",
      className
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator className="grid place-items-center">
      <Check className="size-4" strokeWidth={3} aria-hidden="true" />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
))
Checkbox.displayName = CheckboxPrimitive.Root.displayName

export { Checkbox }
