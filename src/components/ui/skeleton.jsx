// @lsl/skeleton · managed by loystudiolab-ui · change upstream, not here.
import { cn } from "@/lib/utils"

// Flat block that pulses opacity. No shimmer gradient (rule G4). Still under reduced motion.
function Skeleton({ className, ...props }) {
  return <div aria-hidden="true" className={cn("animate-lsl-pulse bg-tint motion-reduce:animate-none", className)} {...props} />
}

export { Skeleton }
