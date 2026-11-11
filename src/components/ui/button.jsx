// @lsl/button · managed by loystudiolab-ui · change upstream, not here.
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority"

import { cn } from "@/lib/utils"

// 2px border, radius 0, no shadow. Colors follow the surface (paper, alt, ink).
// `accent` (butter) is for the single highest-priority CTA on a page (rule C1).
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 text-center whitespace-normal sm:whitespace-nowrap border-2 font-body font-semibold uppercase tracking-[0.06em] transition-colors duration-fast disabled:pointer-events-none disabled:opacity-60 aria-busy:cursor-progress [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "border-fg bg-fg text-surface hover:bg-surface hover:text-fg",
        accent: "border-ink bg-butter text-ink hover:bg-ink hover:text-butter",
        outline: "border-line bg-transparent text-fg hover:bg-fg hover:text-surface",
        ghost: "border-transparent bg-transparent text-fg hover:border-line",
        link: "border-transparent px-0 text-fg underline decoration-butter decoration-2 underline-offset-4 hover:decoration-[5px]",
        destructive: "border-brick bg-brick text-paper hover:bg-surface hover:text-danger",
      },
      size: {
        default: "min-h-12 px-6 py-3 text-sm",
        sm: "min-h-11 px-4 py-2 text-xs",
        lg: "min-h-14 px-8 py-4 text-[0.9375rem]",
        icon: "h-11 w-11 p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const Button = React.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button"
  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      data-lsl-accent={variant === "accent" ? "" : undefined}
      ref={ref}
      {...props}
    />
  )
})
Button.displayName = "Button"

export { Button, buttonVariants }
