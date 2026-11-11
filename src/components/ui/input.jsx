// @lsl/input · managed by loystudiolab-ui · change upstream, not here.
import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex min-h-12 w-full border-2 border-line bg-surface px-4 py-3 font-body text-base text-fg transition-colors duration-fast placeholder:text-fg-2/70 hover:bg-tint disabled:cursor-not-allowed disabled:opacity-60 aria-[invalid=true]:border-danger file:border-0 file:bg-transparent file:font-semibold file:text-fg",
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
Input.displayName = "Input"

export { Input }
