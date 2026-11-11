// @lsl/site-header · managed by loystudiolab-ui · change upstream, not here.
import * as React from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { Menu } from "lucide-react"

import { Logo } from "@/components/lsl/brand/mark"
import { LayerLegend } from "@/components/lsl/brand/glyph"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTitle, SheetTrigger, SheetHeader } from "@/components/ui/sheet"
import { useActiveSection, useGoToSection } from "@/hooks/use-section-nav"
import { cn } from "@/lib/utils"

/*
  Sticky site header with a ruled bottom edge, active-section underline (butter), a
  plain CTA (never `accent`: the page's one accent CTA lives in the content, rule C1),
  and a full-height mobile menu.
  items: [{ label, id }] for sections on the home page, or [{ label, href }] for pages.
*/
export function SiteHeader({ items = [], cta, homePath = "/", showLegend = true, className }) {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const isHome = pathname === homePath
  const ids = items.filter((i) => i.id).map((i) => i.id)
  const active = useActiveSection(ids, isHome)
  const go = useGoToSection(isHome)
  const [open, setOpen] = React.useState(false)

  const hrefOf = (item) => item.href ?? `${homePath}#${item.id}`

  const onLogo = (e) => {
    if (!isHome) return
    e.preventDefault()
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" })
    window.history.replaceState(null, "", homePath)
  }

  return (
    <header className={cn("surface-paper sticky top-0 z-header border-b-2 border-ink", className)}>
      <div className="container-site flex h-[var(--lsl-header-h)] items-center justify-between gap-6">
        <Link to={homePath} onClick={onLogo} className="-m-1 p-1" aria-label="LoyStudioLab, home">
          <Logo />
        </Link>

        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-8">
            {items.map((item) => {
              const isActive = item.id ? active === item.id : pathname === item.href
              return (
                <li key={item.id ?? item.href}>
                  <Link
                    to={hrefOf(item)}
                    onClick={item.id ? (e) => go(item.id, e) : undefined}
                    aria-current={isActive ? (item.id ? "location" : "page") : undefined}
                    className="group relative inline-block py-2 font-body text-[0.9375rem] font-semibold text-fg"
                  >
                    {item.label}
                    <span
                      aria-hidden="true"
                      className={cn(
                        "absolute inset-x-0 -bottom-0.5 h-[3px] origin-left bg-butter transition-transform duration-base group-hover:scale-x-100",
                        isActive ? "scale-x-100" : "scale-x-0"
                      )}
                    />
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          {cta && (
            <Button asChild size="sm" className="hidden sm:inline-flex">
              <Link to={cta.href} onClick={cta.id ? (e) => go(cta.id, e) : undefined}>
                {cta.label}
              </Link>
            </Button>
          )}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="lg:hidden" aria-label="Open menu">
                <Menu className="!size-5" aria-hidden="true" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" aria-describedby={undefined} closeLabel="Close menu">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <nav aria-label="Mobile" className="flex-1 overflow-y-auto">
                <ul className="border-b-2 border-ink">
                  {[...items, ...(cta ? [cta] : [])].map((item, i) => (
                    <li key={item.id ?? item.href} className="border-t-2 border-ink first:border-t-0">
                      <Link
                        to={hrefOf(item)}
                        onClick={(e) => {
                          // Let the sheet close (and release its scroll lock) before moving.
                          e.preventDefault()
                          setOpen(false)
                          setTimeout(() => (item.id && isHome ? go(item.id) : navigate(hrefOf(item))), 320)
                        }}
                        className="flex min-h-11 items-baseline gap-4 px-4 py-5 font-display text-[1.75rem] font-semibold leading-none text-fg hover:bg-tint sm:px-6"
                      >
                        <span className="font-body text-xs font-semibold tracking-[0.08em] text-fg-2">{String(i + 1).padStart(2, "0")}</span>
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
                {showLegend && <LayerLegend className="px-4 py-6 sm:px-6" />}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
