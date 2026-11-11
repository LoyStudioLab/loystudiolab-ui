// @lsl/section-nav · managed by loystudiolab-ui · change upstream, not here.
import { useCallback, useEffect, useState } from "react"

const prefersReduced = () =>
  typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches

/*
  In-page jump: scrolls to a section, updates the hash, and moves focus to the
  section's heading (mark it with data-section-heading and tabIndex={-1}).
  Pass `enabled = false` on pages where the target is not rendered (the link then
  navigates normally).
*/
export function useGoToSection(enabled = true) {
  return useCallback(
    (id, event) => {
      if (!enabled) return
      const el = document.getElementById(id)
      if (!el) return
      event?.preventDefault()
      el.scrollIntoView({ behavior: prefersReduced() ? "auto" : "smooth", block: "start" })
      window.history.replaceState(null, "", `#${id}`)
      el.querySelector("[data-section-heading]")?.focus({ preventScroll: true })
    },
    [enabled]
  )
}

// Which of `ids` is currently in the reading zone (for nav highlighting).
export function useActiveSection(ids, enabled = true) {
  const [active, setActive] = useState(null)
  const key = ids.join("|")
  useEffect(() => {
    if (!enabled || typeof IntersectionObserver === "undefined") {
      setActive(null)
      return undefined
    }
    const list = key.split("|")
    const els = list.map((id) => document.getElementById(id)).filter(Boolean)
    if (!els.length) return undefined
    const visible = new Set()
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => (e.isIntersecting ? visible.add(e.target.id) : visible.delete(e.target.id)))
        setActive(list.find((id) => visible.has(id)) || null)
      },
      { rootMargin: "-35% 0px -60% 0px", threshold: 0 }
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [key, enabled])
  return active
}
