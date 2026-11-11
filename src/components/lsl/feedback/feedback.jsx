// @lsl/feedback · managed by loystudiolab-ui · change upstream, not here.
import { StatusIcon } from "@/components/lsl/feedback/status-icon"
import { cn } from "@/lib/utils"

/*
  Callout: an inline, persistent message inside content.
  tone: info | success | warning | error. For transient messages use the Toaster.
*/
const TONE = {
  info: "border-line",
  success: "border-line",
  warning: "border-line border-l-[6px]",
  error: "border-danger",
}

export function Callout({ tone = "info", title, children, className }) {
  return (
    <div role={tone === "error" ? "alert" : undefined} className={cn("flex gap-3 border-2 bg-surface p-4 text-fg", TONE[tone], className)}>
      <StatusIcon status={tone} className={cn("mt-1", tone === "error" && "text-danger")} />
      <div className="min-w-0">
        {title && <p className={cn("font-semibold", tone === "error" && "text-danger")}>{title}</p>}
        {children && <div className={cn("text-fg-2", title && "mt-1")}>{children}</div>}
      </div>
    </div>
  )
}

/*
  Linear progress. Loading is a bar, never a ring spinner (rule S2).
  Without `value` it is indeterminate (static under reduced motion).
*/
export function LinearLoader({ value, label = "Loading", className }) {
  const determinate = typeof value === "number"
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={determinate ? 0 : undefined}
      aria-valuemax={determinate ? 100 : undefined}
      aria-valuenow={determinate ? Math.round(value) : undefined}
      className={cn("relative h-2 w-full overflow-hidden border-2 border-line bg-surface", className)}
    >
      {determinate ? (
        <div className="h-full bg-fg transition-[width] duration-base ease-lsl" style={{ width: `${Math.max(0, Math.min(100, value))}%` }} />
      ) : (
        <div className="h-full w-2/5 animate-lsl-indeterminate bg-fg motion-reduce:w-full motion-reduce:animate-none motion-reduce:opacity-40" />
      )}
    </div>
  )
}

/*
  Empty, error and not-found states share one ruled frame. Say what happened and
  what to do next, in plain words. `action` is usually a Button.
*/
function StateFrame({ eyebrow, title, children, action, headingLevel = 2, className, status }) {
  const H = `h${headingLevel}`
  return (
    <div className={cn("flex flex-col items-start gap-4 border-2 border-dashed border-line bg-surface p-8 lg:p-12", className)}>
      {status && <StatusIcon status={status} size={32} className={status === "error" ? "text-danger" : undefined} />}
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <H className="heading-2">{title}</H>
      {children && <div className="max-w-prose text-fg-2">{children}</div>}
      {action && <div className="pt-2">{action}</div>}
    </div>
  )
}

export function EmptyState({ title = "Nothing here yet", children, action, headingLevel, className }) {
  return <StateFrame status="pending" title={title} action={action} headingLevel={headingLevel} className={className}>{children}</StateFrame>
}

export function ErrorState({ title = "Something went wrong", children = "It is on our side. Please try again.", action, headingLevel, className }) {
  return (
    <div role="alert" className="contents">
      <StateFrame status="error" title={title} action={action} headingLevel={headingLevel} className={cn("border-solid border-danger", className)}>
        {children}
      </StateFrame>
    </div>
  )
}

export function NotFound({ title = "This page does not exist", children = "The link may be old, or the address has a typo.", action, className }) {
  return <StateFrame eyebrow="404" title={title} action={action} headingLevel={1} className={className}>{children}</StateFrame>
}
