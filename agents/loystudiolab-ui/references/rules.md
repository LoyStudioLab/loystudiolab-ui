# Rules (generated from registry/rules.js, library 0.1.1)

Every rule has an ID. lsl-doctor, the manifest and the docs use the same IDs.
Rationale sections (§) refer to `LoyStudioLab/Website/AESTHETIC_PHILOSOPHY.md`.

## Color

| ID | Rule | Why | Checked by |
|---|---|---|---|
| C1 | One accent (butter) CTA per page, maximum. | Rarity keeps the accent meaningful; frequency erodes salience (Philosophy §2). | doctor + AccentBudget |
| C2 | Butter is never a surface. Allowed only for: the accent CTA, the Studio glyph/square in the mark, hover underlines, focus rings, text selection. | One color, one job (§2). | doctor |
| C3 | Petrol marks the Loy layer only (founder monograms, Loy tags). | Two colors with different jobs must never do the same job (§2). | review |
| C4 | Signal teal only where something is computing or AI-generated. Never decoration. | Signal is Petrol given voltage, reserved for the Lab's live states. | doctor |
| C5 | Text must pass WCAG AA (4.5:1). Concrete, butter, ochre and signal are never text on paper. Use ink-2 for secondary text, brick-deep for errors on paper-alt, signal-ink for Signal text. | Accessible by default. | check-contrast + axe |
| C6 | No raw hex or arbitrary color classes in app code. Tokens only. | One source of truth. | doctor |

## Shape

| ID | Rule | Why | Checked by |
|---|---|---|---|
| S1 | Solid circle = Loy, solid square = Studio, hollow triangle = Lab. These shapes mean nothing else. | Kandinsky's shape logic, mapped to the studio's three real bodies of work (§1.2). | review |
| S2 | No circular or triangular UI chrome: square avatars (except founders), square radios, linear loaders instead of ring spinners, no pie or donut charts. | Consequence of S1. | doctor (rounded-full, spinners) + review |
| S3 | Status icons are square-framed (StatusIcon). Never lucide CircleCheck, AlertTriangle, Info or XCircle. | Consequence of S1. | doctor |

## Geometry

| ID | Rule | Why | Checked by |
|---|---|---|---|
| G1 | Radius 0 everywhere. | A rounded corner softens an edge that has no reason to be soft (§1.1). | doctor + preset |
| G2 | Meaningful boundaries are 2px ink (or the surface's line color). The rule color #D8D2C2 is for decorative inner dividers only. | One visual question per edge (§3). | review |
| G3 | No shadows. Overlays use a 2px border and an ink scrim. | A shadow implies a light source that does not exist (§1.1). | doctor + preset |
| G4 | No gradients (including skeleton shimmer). | Ambiguous depth cues cost reading effort (§3). | doctor |
| G5 | Base-8 spacing. Use Stack/Cluster/Grid gap steps; half-steps (4px, 12px) only in tight UI. | Exposed, regular structure (§3). | review |

## Type

| ID | Rule | Why | Checked by |
|---|---|---|---|
| T1 | Jost for display and headings, Archivo for body and UI. No other families. | A working revival of a working revival (§1.4). | doctor |
| T2 | Heading levels are semantic and sequential (one h1, no skips). Visual size is a separate prop. | Structure for screen readers; looks are independent. | doctor (per file) + axe |
| T3 | Fonts load via <link> in index.html with preconnect, never CSS @import. | Faster first paint. | doctor |
| T4 | Use the fluid type scale (display, h1, h2, h3, lead, body, small, eyebrow, label). No ad-hoc font sizes for headings. | Consistency across sites. | review |

## Accessibility

| ID | Rule | Why | Checked by |
|---|---|---|---|
| A1 | AA contrast for all text and UI boundaries. | Accessible by default. | axe + check-contrast |
| A2 | Visible focus: butter ring hugging the element plus an ink (or paper) outline. Never remove focus styles. | Butter alone is 1.55:1 on paper; the outline carries the contrast. | preset |
| A3 | Everything works with a keyboard; icon-only controls have labels. |  | tests + review |
| A4 | Respect prefers-reduced-motion. |  | preset |
| A5 | Every control has a visible label; errors are linked with aria-describedby; focus moves to the first invalid field, the error alert or the success heading. |  | doctor (bare inputs) + tests |
| A6 | Skip link, landmarks (header, main, footer, nav labels) and a unique document title on every page. |  | SiteShell + axe |
| A7 | Touch targets at least 44px. |  | components |
| A8 | Every image has alt text; alt="" only when purely decorative. |  | doctor |

## Motion

| ID | Rule | Why | Checked by |
|---|---|---|---|
| M1 | Motion explains (assembly, state change, reveal). It never decorates or loops, except the Signal computing indicator. | Functional honesty (§1.1). | review |
| M2 | CSS only, durations 150/250/550ms, easing cubic-bezier(0.2,0.7,0.2,1). No framer-motion. | Small bundles, one motion language. | doctor |
| M3 | Reveals are fail-safe: content is visible unless an IntersectionObserver has proven it runs. | Never hide content behind JavaScript. | Reveal |

## Writing

| ID | Rule | Why | Checked by |
|---|---|---|---|
| W1 | All UI copy in English. |  | review |
| W2 | No em dashes. Use periods, commas or colons. | Reads as machine-written to our audience. | doctor |
| W3 | No superlatives or hype (best, leading, revolutionary, cutting-edge, seamless, world-class, game-changing). | Janteloven: confidence without volume (§1.5). | doctor |
| W4 | No stats as flex, no invented numbers. | Janteloven (§1.5). | review |
| W5 | Real assets over recreations: real screenshots, real quotes, real clients only. | Functional honesty. | review |
| W6 | Copy lives in a data file (src/data/content.js), not inside components. | Edit words without touching layout. | review |
