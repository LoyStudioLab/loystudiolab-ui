// @lsl/accent-budget · managed by loystudiolab-ui · change upstream, not here.
import { useEffect } from "react"

/*
  Dev-only guard for rule C1: one accent (butter) CTA per page.
  Mount once near the root: <AccentBudget />. In development it warns in the console
  when more than one element with data-lsl-accent is on screen. Renders nothing and
  does nothing in production builds.
*/
export function AccentBudget({ max = 1 }) {
  useEffect(() => {
    if (!import.meta.env?.DEV || typeof MutationObserver === "undefined") return undefined
    let timer
    let lastWarned = 0
    const check = () => {
      const found = document.querySelectorAll("[data-lsl-accent]").length
      if (found > max && found !== lastWarned) {
        lastWarned = found
        console.warn(`[LSL-C1] ${found} accent CTAs on this page. Keep one; make the others default or outline.`)
      }
      if (found <= max) lastWarned = 0
    }
    const mo = new MutationObserver(() => {
      clearTimeout(timer)
      timer = setTimeout(check, 300)
    })
    mo.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ["data-lsl-accent"] })
    check()
    return () => {
      clearTimeout(timer)
      mo.disconnect()
    }
  }, [max])
  return null
}
