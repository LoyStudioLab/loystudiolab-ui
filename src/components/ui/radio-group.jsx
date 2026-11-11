// @lsl/radio-group · managed by loystudiolab-ui · change upstream, not here.
import * as React from "react"
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group"

import { cn } from "@/lib/utils"

// Square, not round: circles mean Loy and nothing else (rule S2).
const RadioGroup = React.forwardRef(({ className, ...props }, ref) => (
  <RadioGroupPrimitive.Root className={cn("grid gap-3", className)} {...props} ref={ref} />
))
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName

const RadioGroupItem = React.forwardRef(({ className, ...props }, ref) => (
  <RadioGroupPrimitive.Item
    ref={ref}
    className={cn(
      "grid size-6 shrink-0 place-items-center border-2 border-line bg-surface transition-colors duration-fast hover:bg-tint disabled:cursor-not-allowed disabled:opacity-60 aria-[invalid=true]:border-danger",
      className
    )}
    {...props}
  >
    <RadioGroupPrimitive.Indicator className="block size-2.5 bg-fg" />
  </RadioGroupPrimitive.Item>
))
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName

export { RadioGroup, RadioGroupItem }
