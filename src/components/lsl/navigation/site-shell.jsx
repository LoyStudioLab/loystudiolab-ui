// @lsl/site-shell · managed by loystudiolab-ui · change upstream, not here.
import { cn } from "@/lib/utils"

// First focusable element on every page (rule A6).
export function SkipLink({ href = "#main", children = "Skip to content" }) {
  return (
    <a href={href} className="skip-link">
      {children}
    </a>
  )
}

/*
  Page frame with landmarks: skip link, header, <main id="main">, footer.
  With react-router, render it as a layout route and pass <Outlet /> as children.
*/
export function SiteShell({ header, footer, children, className }) {
  return (
    <div className={cn("surface-paper flex min-h-screen flex-col", className)}>
      <SkipLink />
      {header}
      <main id="main" tabIndex={-1} className="flex-1 focus:outline-none">
        {children}
      </main>
      {footer}
    </div>
  )
}
