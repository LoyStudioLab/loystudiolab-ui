// @lsl/status-icon · managed by loystudiolab-ui · change upstream, not here.
import { cn } from "@/lib/utils"

/*
  Status marks are square-framed (rule S3). Circles and triangles carry brand meaning
  (Loy, Lab), so lucide's CircleCheck, AlertTriangle and Info are not used for status.
  - info:    hollow square with "i"
  - success: solid square with a check
  - warning: hollow square with "!" (thick frame)
  - error:   hollow square with "!"
  - pending: hollow square with a centred bar
  Decorative by default; pass `label` when the icon is the only carrier of meaning.
*/
const PATHS = {
  info: (
    <>
      <rect x="1" y="1" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M8 7v5M8 4v1.5" stroke="currentColor" strokeWidth="2" />
    </>
  ),
  success: (
    <>
      <rect x="0" y="0" width="16" height="16" fill="currentColor" />
      <path d="M4 8.5l2.7 2.7L12.2 5.5" fill="none" stroke="rgb(var(--lsl-surface))" strokeWidth="2" strokeLinejoin="miter" />
    </>
  ),
  warning: (
    <>
      <rect x="1.5" y="1.5" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="3" />
      <path d="M8 4.5v4.5M8 10.5v1.5" stroke="currentColor" strokeWidth="2" />
    </>
  ),
  error: (
    <>
      <rect x="1" y="1" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M8 4v5M8 11v1.5" stroke="currentColor" strokeWidth="2" />
    </>
  ),
  pending: (
    <>
      <rect x="1" y="1" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M5 8h6" stroke="currentColor" strokeWidth="2" />
    </>
  ),
}

export function StatusIcon({ status = "info", size = 16, label, className }) {
  return (
    <svg
      viewBox="0 0 16 16"
      width={size}
      height={size}
      className={cn("shrink-0", className)}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      focusable="false"
    >
      {PATHS[status] ?? PATHS.info}
    </svg>
  )
}
