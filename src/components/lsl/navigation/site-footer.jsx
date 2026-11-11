// @lsl/site-footer · managed by loystudiolab-ui · change upstream, not here.
import { Link } from "react-router-dom"

import { Logo } from "@/components/lsl/brand/mark"
import { LayerLegend } from "@/components/lsl/brand/glyph"
import { cn } from "@/lib/utils"

/*
  Site footer on paper-alt: logo, tagline and contact; a site nav column; the
  "how to read our marks" legend; a ruled bottom line.
  links: [{ label, href }]
*/
export function SiteFooter({
  tagline = "Design and technology studio. Oslo, Norway.",
  email,
  links = [],
  showLegend = true,
  note = "Built by us, with the same process we use for clients.",
  className,
}) {
  return (
    <footer className={cn("surface-alt border-t-2 border-ink", className)}>
      <div className="container-site grid gap-10 py-12 md:grid-cols-12 md:py-16">
        <div className="md:col-span-5">
          <Logo />
          <p className="mt-4 max-w-xs text-fg-2">{tagline}</p>
          {email && (
            <a href={`mailto:${email}`} className="link-u mt-4 inline-block">
              {email}
            </a>
          )}
        </div>
        {links.length > 0 && (
          <nav aria-label="Footer" className="md:col-span-3">
            <p className="eyebrow mb-4">Site</p>
            <ul className="space-y-2">
              {links.map((l) => (
                <li key={l.href}>
                  <Link to={l.href} className="font-semibold text-fg hover:underline hover:decoration-butter hover:decoration-2 hover:underline-offset-4">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}
        {showLegend && (
          <div className="md:col-span-4">
            <p className="eyebrow mb-4">How to read our marks</p>
            <LayerLegend />
          </div>
        )}
      </div>
      <div className="border-t-2 border-ink">
        <div className="container-site flex flex-col gap-2 py-5 text-sm text-fg-2 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} LoyStudioLab</p>
          {note && <p>{note}</p>}
        </div>
      </div>
    </footer>
  )
}
