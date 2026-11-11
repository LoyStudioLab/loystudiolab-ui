// @lsl/reveal · managed by loystudiolab-ui · change upstream, not here.
import { useEffect, useRef, useState } from "react"

import { cn } from "@/lib/utils"

/*
  Quiet scroll reveal: a 16px rise and fade, once (rules M1, M3).
  Fail-safe: content is visible by default. The hidden-until-seen state is only armed
  (html.lsl-reveal-ready) after an IntersectionObserver has actually reported back, so
  a browser that never runs observers still shows everything. Reduced motion shows
  content at once.
*/
let armed = false
function arm() {
  if (armed || typeof window === "undefined" || !("IntersectionObserver" in window)) return
  armed = true
  const probe = new IntersectionObserver(() => {
    document.documentElement.classList.add("lsl-reveal-ready")
    probe.disconnect()
  })
  probe.observe(document.body)
}

export function Reveal({ as: Tag = "div", delay = 0, className, style, children, ...rest }) {
  const ref = useRef(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    arm()
    const el = ref.current
    if (!el) return undefined
    if (!("IntersectionObserver" in window)) {
      setShown(true)
      return undefined
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true)
          io.disconnect()
        }
      },
      { rootMargin: "0px 0px -8% 0px" }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <Tag
      ref={ref}
      className={cn("lsl-reveal", shown && "is-in", className)}
      style={delay ? { ...style, transitionDelay: `${delay}s` } : style}
      {...rest}
    >
      {children}
    </Tag>
  )
}

// One-time entrance for above-the-fold content (hero). CSS only.
export function Rise({ as: Tag = "div", delay = 0, className, style, ...rest }) {
  return <Tag className={cn("lsl-rise", className)} style={delay ? { ...style, animationDelay: `${delay}s` } : style} {...rest} />
}
