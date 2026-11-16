// @lsl/mark · managed by loystudiolab-ui · change upstream, not here.
import * as React from "react"
import { cn } from "@/lib/utils"
import { LayerLegend } from "@/components/lsl/brand/glyph"
import { useReducedMotion } from "@/hooks/use-reduced-motion"

/*
  The LoyStudioLab logo (final, 2026-11). Traced from the master file
  studio/brand/logo/loystudiolab-lockup.png: every edge was fitted to the pixels.
  Three separate shapes, in this z-order (rule S1):
    lsl-circle   Loy.    Solid circle.
    lsl-triangle Lab.    A cut into the circle: negative space, so it shows the surface.
                         Equilateral, rotated 1.52deg; its third corner sits outside the circle.
    lsl-square   Studio. Solid square, rotated 16.46deg, landing in the corner of the cut.
  Wordmark: LOY STUDIO in Jost Black (outlined), LAB custom letterforms (outlined).
  Colors are the logo file's own (tokens.logo), not the UI palette: the yellow is
  #F5B640, not the butter accent. On an ink surface the circle and LAB turn cream
  automatically (--lsl-logo-circle, --lsl-logo-lab), and the cut always shows the surface.
*/
export const MARK_GEOMETRY = {
  viewBox: "0 0 512 512",
  circle: { cx: 256, cy: 256, r: 256 },
  trianglePath: "M195.32 51.81L405.24 438.83L68.09 429.86A256 256 0 0 1 15.78 344.5Z",
  squarePath: "M234.71 124.54L420.37 179.38L365.54 365.03L179.88 310.2Z",
  // Mono: circle with the cut and a 12-unit gap around the square, so all three
  // shapes still read in one color.
  monoCutPath: "M15.78 344.5L195.32 51.81L226.7 109.66L435.28 171.27L373.52 380.35L405.24 438.83L68.09 429.86A256 256 0 1 0 15.78 344.5Z",
  // Animation frame for the Lab wipe: origin at the triangle's outer corner, x axis
  // pointing across the triangle toward its right edge (height 381.3).
  wipe: { x: -34.89, y: 427.11, angle: -28.475, depth: 381.3 },
  // Direction the square lands from (its outer corner points this way).
  squareFrom: { x: 0.8784, y: -0.4778 },
}

export const LOCKUP_GEOMETRY = {
  viewBox: "0 -4.84 1200.43 516.84",
  aspect: 2.3226,
  loy: "M585.17 -1.73V107.24H663.79V78.44H619.42V-1.73ZM700.03 52.76Q700.03 44.66 702.99 38.67Q705.95 32.67 711.4 29.33Q716.84 25.98 724.47 25.98Q732.57 25.98 737.94 29.33Q743.31 32.67 746.11 38.67Q748.91 44.66 748.91 52.76Q748.91 60.7 745.96 66.77Q743 72.84 737.55 76.19Q732.1 79.53 724.47 79.53Q716.84 79.53 711.4 76.19Q705.95 72.84 702.99 66.77Q700.03 60.7 700.03 52.76ZM663.76 52.76Q663.76 65.83 668.2 76.65Q672.63 87.47 680.73 95.41Q688.82 103.35 699.95 107.63Q711.08 111.91 724.47 111.91Q737.86 111.91 748.99 107.63Q760.12 103.35 768.22 95.41Q776.31 87.47 780.75 76.65Q785.19 65.83 785.19 52.76Q785.19 39.68 780.67 29.09Q776.16 18.51 767.91 10.88Q759.65 3.25 748.6 -0.8Q737.55 -4.84 724.47 -4.84Q711.71 -4.84 700.65 -0.8Q689.6 3.25 681.35 10.88Q673.1 18.51 668.43 29.09Q663.76 39.68 663.76 52.76ZM858.31 -1.73 841.19 33.45 824.06 -1.73H784.36L823.75 64.74V107.24H858.78V64.43L898.01 -1.73Z",
  studio: "M601.97 214.59 578.93 231.4Q582.66 239.65 589.98 246.35Q597.3 253.04 607.34 256.86Q617.38 260.67 629.06 260.67Q637.46 260.67 645.4 258.34Q653.34 256 659.65 251.49Q665.95 246.97 669.69 240.04Q673.42 233.12 673.42 224.09Q673.42 217.7 671.55 212.49Q669.69 207.27 666.03 203.07Q662.37 198.87 657.23 195.68Q652.1 192.48 645.56 190.15Q639.17 187.81 633.88 186.02Q628.59 184.23 625.4 182.13Q622.21 180.03 622.21 176.76Q622.21 174.11 624.46 172.87Q626.72 171.62 630.3 171.62Q633.26 171.62 636.37 172.71Q639.49 173.8 642.52 176.06Q645.56 178.32 648.05 182.21L673.42 168.2Q670.46 162.59 664.78 156.99Q659.1 151.39 650.3 147.65Q641.51 143.91 629.21 143.91Q617.85 143.91 608.35 147.65Q598.85 151.39 593.09 158.7Q587.33 166.02 587.33 176.76Q587.33 185.01 590.37 191.08Q593.41 197.15 598 201.36Q602.59 205.56 607.65 208.21Q612.71 210.85 616.6 212.41Q625.47 215.84 629.83 217.86Q634.19 219.88 635.67 221.44Q637.15 223 637.15 225.18Q637.15 228.76 634.35 230.39Q631.55 232.03 627.5 232.03Q622.67 232.03 617.92 230Q613.18 227.98 609.13 224.01Q605.08 220.04 601.97 214.59ZM678.82 177.38H709.96V256H744.21V177.38H775.34V147.03H678.82ZM785.51 147.03V220.19Q785.51 231.87 789.32 239.89Q793.13 247.9 799.83 252.81Q806.52 257.71 815.16 259.97Q823.8 262.23 833.45 262.23Q843.11 262.23 851.75 259.97Q860.39 257.71 867.08 252.81Q873.77 247.9 877.59 239.89Q881.4 231.87 881.4 220.19V147.03H847.15V217.08Q847.15 223.62 843.81 227.74Q840.46 231.87 833.45 231.87Q826.45 231.87 823.1 227.74Q819.75 223.62 819.75 217.08V147.03ZM902.51 147.03V256H938.04V147.03ZM945.18 256Q964.11 256 977.68 249.46Q991.26 242.92 998.48 230.7Q1005.69 218.48 1005.69 201.51Q1005.69 184.39 998.48 172.25Q991.26 160.1 977.68 153.57Q964.11 147.03 945.18 147.03H926.09V176.61H943.63Q948.13 176.61 952.78 177.38Q957.44 178.16 961.32 180.65Q965.19 183.14 967.6 188.13Q970 193.11 970 201.51Q970 209.92 967.6 214.9Q965.19 219.88 961.32 222.37Q957.44 224.86 952.78 225.64Q948.13 226.42 943.63 226.42H926.09V256ZM1021.51 147.03V256H1056.54V147.03ZM1108.37 201.51Q1108.37 193.42 1111.33 187.42Q1114.29 181.43 1119.74 178.08Q1125.19 174.74 1132.81 174.74Q1140.91 174.74 1146.28 178.08Q1151.65 181.43 1154.45 187.42Q1157.25 193.42 1157.25 201.51Q1157.25 209.45 1154.3 215.52Q1151.34 221.6 1145.89 224.94Q1140.44 228.29 1132.81 228.29Q1125.19 228.29 1119.74 224.94Q1114.29 221.6 1111.33 215.52Q1108.37 209.45 1108.37 201.51ZM1072.1 201.51Q1072.1 214.59 1076.54 225.41Q1080.97 236.23 1089.07 244.17Q1097.16 252.11 1108.29 256.39Q1119.43 260.67 1132.81 260.67Q1146.2 260.67 1157.33 256.39Q1168.46 252.11 1176.56 244.17Q1184.65 236.23 1189.09 225.41Q1193.53 214.59 1193.53 201.51Q1193.53 188.44 1189.01 177.85Q1184.5 167.26 1176.25 159.64Q1168 152.01 1156.94 147.96Q1145.89 143.91 1132.81 143.91Q1120.05 143.91 1109 147.96Q1097.94 152.01 1089.69 159.64Q1081.44 167.26 1076.77 177.85Q1072.1 188.44 1072.1 201.51Z",
  lab: "M584.65 299.24L584.65 512L739.09 512L771.48 453.2L652.11 451.36L652.11 299.24ZM871.96 297.49L751.5 512L817.44 512L878.81 397.95L917.06 470.49L878.98 470.49L856.74 512L996.51 512ZM1007.57 297.51L1007.57 512L1145.04 512L1200.43 451.59L1157.86 397.91L1186.65 347.08L1139.88 297.51ZM1075.03 426.62L1127.58 446.02L1075.03 462.66ZM1075.03 346.81L1116.75 367.68L1075.03 384.33Z",
}

export const LOGO_COLORS = { ink: "#161512", lab: "#1B1A17", cream: "#F3EFE5", yellow: "#F5B640" }

const C = {
  circle: "rgb(var(--lsl-logo-circle, 22 21 18))",
  cut: "rgb(var(--lsl-surface, 243 239 229))",
  yellow: "rgb(var(--lsl-logo-yellow, 245 182 64))",
  lab: "rgb(var(--lsl-logo-lab, 27 26 23))",
}

// Minimum sizes (rule LOGO): mark 16px, lockup 40px tall.
export const LOGO_MIN = { mark: 16, lockup: 40 }

function MarkShapes({ tone }) {
  const g = MARK_GEOMETRY
  if (tone === "mono") {
    return (
      <g fill="currentColor">
        <path data-shape="lsl-circle" d={g.monoCutPath} />
        <path data-shape="lsl-square" d={g.squarePath} />
      </g>
    )
  }
  return (
    <g>
      <circle data-shape="lsl-circle" {...g.circle} fill={C.circle} />
      <path data-shape="lsl-triangle" d={g.trianglePath} fill={C.cut} />
      <path data-shape="lsl-square" d={g.squarePath} fill={C.yellow} />
    </g>
  )
}

const a11y = (title) =>
  title ? { role: "img", "aria-label": title } : { "aria-hidden": true }

/*
  The mark alone: favicons, app icons, avatars, tight spaces, or next to the name
  set in running text. tone="mono" draws everything in currentColor (text-fg by default).
*/
export function Mark({ size = 40, tone = "color", title, className }) {
  return (
    <svg
      viewBox={MARK_GEOMETRY.viewBox}
      width={Math.max(size, LOGO_MIN.mark)}
      height={Math.max(size, LOGO_MIN.mark)}
      className={cn("shrink-0", tone === "mono" && "text-fg", className)}
      focusable="false"
      {...a11y(title)}
    >
      <MarkShapes tone={tone} />
    </svg>
  )
}

/*
  The lockup: mark + LOY / STUDIO / LAB. The default logo for headers, footers,
  covers and share images. `height` is in pixels; width follows (aspect 2.32).
*/
export function Lockup({ height = 44, tone = "color", title = "LoyStudioLab", className }) {
  const h = Math.max(height, LOGO_MIN.lockup)
  const L = LOCKUP_GEOMETRY
  const mono = tone === "mono"
  return (
    <svg
      viewBox={L.viewBox}
      height={h}
      width={Math.round(h * L.aspect)}
      className={cn("shrink-0", mono && "text-fg", className)}
      focusable="false"
      {...a11y(title)}
    >
      <MarkShapes tone={tone} />
      <g fill={mono ? "currentColor" : undefined}>
        <path data-shape="lsl-word-loy" d={L.loy} fill={mono ? undefined : C.yellow} />
        <path data-shape="lsl-word-studio" d={L.studio} fill={mono ? undefined : C.yellow} />
        <path data-shape="lsl-word-lab" d={L.lab} fillRule="evenodd" fill={mono ? undefined : C.lab} />
      </g>
    </svg>
  )
}

/*
  One entry point. variant "lockup" (default) or "mark".
  "horizontal" and "stacked" are kept from 0.1 and both render the lockup:
  there is no horizontal logo, and the name is never set in Jost next to the mark.
*/
export function Logo({ variant = "lockup", size, tone = "color", title = "LoyStudioLab", className }) {
  if (variant === "mark") return <Mark size={size ?? 40} tone={tone} title={title} className={className} />
  return <Lockup height={size ?? 44} tone={tone} title={title} className={className} />
}

const ORDER = ["loy", "lab", "studio"]
const STEP_MS = 650

/*
  The logo assembling itself, for a hero or an about page:
    1. the circle appears (Loy)
    2. the triangle cuts into it, as a wipe (Lab)
    3. the square lands in the corner of the cut (Studio)
  Each step reports its layer through onStep, and with `legend` it highlights the
  matching LayerLegend item. Reduced motion: the final logo, no movement (A4).
  Fail-safe (M3): the logo is fully drawn unless the sequence has actually started.
*/
export function LogoAssemble({
  trigger = "visible",
  legend = false,
  focus = null,
  onStep,
  replayKey,
  title,
  className,
  markClassName,
}) {
  const reduced = useReducedMotion()
  const ref = React.useRef(null)
  const [step, setStep] = React.useState(3)
  const [active, setActive] = React.useState(null)
  const [hover, setHover] = React.useState(null)
  const uid = React.useId().replace(/[^a-zA-Z0-9_-]/g, "")
  const onStepRef = React.useRef(onStep)
  onStepRef.current = onStep

  React.useLayoutEffect(() => {
    if (reduced || trigger === "none") {
      setStep(3)
      setActive(null)
      return undefined
    }
    let timers = []
    let io
    const run = () => {
      setStep(0)
      const tick = (n) => {
        setStep(n)
        const layer = n <= 3 ? ORDER[n - 1] : null
        setActive(layer)
        onStepRef.current?.(layer)
      }
      timers = [1, 2, 3, 4].map((n) => setTimeout(() => tick(n), 40 + (n - 1) * STEP_MS))
    }
    const el = ref.current
    const inView = () => {
      const r = el?.getBoundingClientRect()
      return !!r && r.top < window.innerHeight && r.bottom > 0
    }
    if (trigger === "mount" || (el && inView())) run()
    else if (el && "IntersectionObserver" in window) {
      // Hide only once the observer has proven it runs (M3).
      io = new IntersectionObserver(
        (entries) => {
          if (entries.some((e) => e.isIntersecting)) {
            io.disconnect()
            run()
          } else setStep(0)
        },
        { threshold: 0.4 }
      )
      io.observe(el)
    }
    return () => {
      timers.forEach(clearTimeout)
      io?.disconnect()
    }
  }, [reduced, trigger, replayKey])

  const g = MARK_GEOMETRY
  // Shapes dim only for an explicit focus or a legend hover. The running step only
  // lights the legend: dimming the circle mid-sequence would hide the cut.
  const lit = focus ?? hover
  const dim = (key) => ({
    opacity: lit && lit !== key ? 0.18 : 1,
    transition: "opacity var(--lsl-dur-base, 250ms) ease",
  })
  // Step 0 is a reset: jump, never fade out.
  const move = reduced || step === 0
    ? "none"
    : "transform var(--lsl-dur-slow, 550ms) var(--lsl-ease, ease), opacity var(--lsl-dur-slow, 550ms) var(--lsl-ease, ease)"
  const W = g.wipe
  const svg = (
    <svg
      ref={legend ? undefined : ref}
      viewBox={g.viewBox}
      className={cn("block w-full", legend ? markClassName : className)}
      focusable="false"
      data-step={step}
      {...a11y(title)}
    >
      <defs>
        <clipPath id={`lsl-wipe-${uid}`}>
          {/* clipPath may not contain <g>: the whole frame transform sits on the rect. */}
          <rect
            x="-12"
            y="-320"
            width={W.depth + 24}
            height="640"
            style={{
              transform: `translate(${W.x}px, ${W.y}px) rotate(${W.angle}deg) translateX(${step >= 2 ? 0 : -(W.depth + 36)}px)`,
              transformOrigin: "0 0",
              transition: move,
            }}
          />
        </clipPath>
      </defs>
      <g style={dim("loy")}>
        <circle
          data-shape="lsl-circle"
          {...g.circle}
          fill={C.circle}
          style={{
            opacity: step >= 1 ? 1 : 0,
            transform: step >= 1 ? "none" : "scale(0.86)",
            transformOrigin: "256px 256px",
            transition: move,
          }}
        />
      </g>
      <g style={dim("lab")}>
        <path data-shape="lsl-triangle" d={g.trianglePath} fill={C.cut} clipPath={`url(#lsl-wipe-${uid})`} />
      </g>
      <g style={dim("studio")}>
        <path
          data-shape="lsl-square"
          d={g.squarePath}
          fill={C.yellow}
          style={{
            opacity: step >= 3 ? 1 : 0,
            transform: step >= 3 ? "none" : `translate(${g.squareFrom.x * 56}px, ${g.squareFrom.y * 56}px)`,
            transition: move,
          }}
        />
      </g>
    </svg>
  )
  if (!legend) return svg
  return (
    <div ref={ref} className={cn("grid items-center gap-8 sm:grid-cols-2", className)}>
      {svg}
      <LayerLegend active={lit ?? active} onActiveChange={setHover} order={ORDER} />
    </div>
  )
}

// 0.1 name, kept so existing pages keep working. Use LogoAssemble.
export function AssemblingMark({ focus = null, className }) {
  return <LogoAssemble trigger="mount" focus={focus} className={className} />
}
