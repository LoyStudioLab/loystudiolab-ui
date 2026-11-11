// @lsl/textarea · managed by loystudiolab-ui · change upstream, not here.
import * as React from "react"

import { cn } from "@/lib/utils"

const Textarea = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "flex min-h-[160px] w-full resize-y border-2 border-line bg-surface px-4 py-3 font-body text-base leading-relaxed text-fg transition-colors duration-fast placeholder:text-fg-2/70 hover:bg-tint disabled:cursor-not-allowed disabled:opacity-60 aria-[invalid=true]:border-danger",
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
Textarea.displayName = "Textarea"

export { Textarea }
