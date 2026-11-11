// @lsl/breadcrumbs · managed by loystudiolab-ui · change upstream, not here.
import * as React from "react"
import { Link } from "react-router-dom"

import { cn } from "@/lib/utils"

/*
  items: [{ label, href }]; the last item is the current page (no link).
  NavLink: a standalone nav link with the butter active underline.
*/
export function Breadcrumbs({ items, className }) {
  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className="flex flex-wrap items-center gap-2 text-sm">
        {items.map((item, i) => {
          const last = i === items.length - 1
          return (
            <li key={item.href ?? item.label} className="flex items-center gap-2">
              {last ? (
                <span aria-current="page" className="font-semibold text-fg">
                  {item.label}
                </span>
              ) : (
                <>
                  <Link to={item.href} className="text-fg-2 underline decoration-transparent underline-offset-4 hover:text-fg hover:decoration-butter hover:decoration-2">
                    {item.label}
                  </Link>
                  <span aria-hidden="true" className="text-fg-2">
                    /
                  </span>
                </>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

export const NavLink = React.forwardRef(function NavLink({ to, active = false, className, children, ...props }, ref) {
  return (
    <Link
      ref={ref}
      to={to}
      aria-current={active ? "page" : undefined}
      className={cn("group relative inline-block py-2 font-body text-[0.9375rem] font-semibold text-fg", className)}
      {...props}
    >
      {children}
      <span
        aria-hidden="true"
        className={cn(
          "absolute inset-x-0 -bottom-0.5 h-[3px] origin-left bg-butter transition-transform duration-base group-hover:scale-x-100",
          active ? "scale-x-100" : "scale-x-0"
        )}
      />
    </Link>
  )
})
