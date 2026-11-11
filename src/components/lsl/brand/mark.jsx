// @lsl/mark · managed by loystudiolab-ui · change upstream, not here.
import { cn } from "@/lib/utils"

/*
  The LoyStudioLab mark, built from the three shapes of the system (rule S1).
  Solid circle = Loy (the founders). Solid butter square = Studio (client work).
  Hollow triangle = Lab: the open space where the other two overlap.
  INTERIM: the final logo is still being drawn. All geometry lives in MARK_GEOMETRY,
  so the final mark replaces it in one place. Colors follow the surface, so the mark
  reads on paper, paper-alt and ink.
*/
export const MARK_GEOMETRY = {
  viewBox: "0 0 120 120",
  circle: { cx: 46, cy: 46, r: 34 },
  square: { x: 52, y: 52, width: 56, height: 56 },
  triangle: "68,44 92,88 44,88",
  trianglePath: "M68 44 L92 88 L44 88 Z",
}

const FG = "rgb(var(--lsl-fg))"
const SURFACE = "rgb(var(--lsl-surface))"
const BUTTER = "rgb(var(--lsl-butter))"

export function Mark({ size = 40, title, className }) {
  const g = MARK_GEOMETRY
  return (
    <svg
      viewBox={g.viewBox}
      width={size}
      height={size}
      className={cn("shrink-0", className)}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      <circle {...g.circle} fill={FG} />
      <rect {...g.square} fill={BUTTER} />
      <polygon points={g.triangle} fill={SURFACE} stroke={FG} strokeWidth="4" strokeLinejoin="miter" />
    </svg>
  )
}

/*
  Animated, explorable mark for a hero. Shapes assemble once on load (CSS, off under
  reduced motion). `focus` ("loy" | "studio" | "lab") dims the other two so a legend
  can point at one layer at a time.
*/
export function AssemblingMark({ focus = null, className }) {
  const g = MARK_GEOMETRY
  const dim = (key, low = 0.16) => ({
    opacity: focus && focus !== key ? low : 1,
    transition: "opacity var(--lsl-dur-base) ease",
  })
  return (
    <svg viewBox={g.viewBox} className={className} aria-hidden="true" focusable="false">
      <g style={dim("loy")}>
        <circle {...g.circle} fill={FG} className="lsl-in-tl" />
      </g>
      <g style={dim("studio")}>
        <rect {...g.square} fill={BUTTER} className="lsl-in-br" />
      </g>
      <polygon points={g.triangle} fill={SURFACE} className="lsl-fade" />
      <path
        d={g.trianglePath}
        pathLength="1"
        fill="none"
        stroke={FG}
        strokeWidth="4"
        strokeLinejoin="miter"
        className="lsl-draw"
        style={dim("lab", 0.25)}
      />
    </svg>
  )
}

/*
  Wordmark lockups.
  - horizontal: mark + "LoyStudioLab" (headers, footers)
  - stacked:    LOY / STUDIO / LAB, as in the original sketch (posters, covers)
  - mark:       mark only (favicons, tight spaces); needs `title` if it stands alone
*/
export function Logo({ variant = "horizontal", size, title = "LoyStudioLab", className }) {
  if (variant === "mark") return <Mark size={size ?? 40} title={title} className={className} />
  if (variant === "stacked") {
    return (
      <span className={cn("inline-flex items-end gap-4", className)}>
        <Mark size={size ?? 72} />
        <span className="font-display text-[2rem] font-bold uppercase leading-[0.95] tracking-[0.04em] text-fg">
          Loy
          <br />
          Studio
          <br />
          Lab
        </span>
      </span>
    )
  }
  return (
    <span className={cn("inline-flex items-center gap-3", className)}>
      <Mark size={size ?? 36} />
      <span className="font-display text-[1.1875rem] font-semibold leading-none tracking-[-0.01em] text-fg">LoyStudioLab</span>
    </span>
  )
}
