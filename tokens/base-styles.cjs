/*
  Hand-written global styles, embedded into the generated Tailwind preset by
  scripts/build-tokens.mjs. Plain CSS-in-JS objects (no @apply) so the preset is a
  single self-contained file in every consuming app. Colors always come from vars.
*/
const c = (name, alpha) => (alpha == null ? `rgb(var(--lsl-${name}))` : `rgb(var(--lsl-${name}) / ${alpha})`);
const EASE = "var(--lsl-ease)";

const base = {
  "*, *::before, *::after": { borderRadius: "0 !important" },
  html: { WebkitTextSizeAdjust: "100%" },
  body: {
    backgroundColor: c("surface"),
    color: c("fg"),
    fontFamily: "var(--lsl-font-body)",
    fontSize: "1rem",
    lineHeight: "1.6",
    textRendering: "optimizeLegibility",
    WebkitFontSmoothing: "antialiased",
    MozOsxFontSmoothing: "grayscale",
  },
  "h1, h2, h3, h4, h5, h6": {
    fontFamily: "var(--lsl-font-display)",
    color: "inherit",
    letterSpacing: "-0.01em",
    textWrap: "balance",
  },
  p: { textWrap: "pretty" },
  "::selection": { background: c("butter"), color: c("ink") },
  ":focus": { outline: "none" },
  ":focus-visible": {
    outline: `3px solid ${c("focus-outer")}`,
    outlineOffset: "3px",
    boxShadow: `0 0 0 3px ${c("focus-inner")}`,
  },
  '[tabindex="-1"]:focus-visible': { outline: "none", boxShadow: "none" },
  "[id]": { scrollMarginTop: "var(--lsl-header-h)" },
  "@media (prefers-reduced-motion: reduce)": {
    "*, *::before, *::after": {
      animationDuration: "0.01ms !important",
      animationIterationCount: "1 !important",
      transitionDuration: "0.01ms !important",
      scrollBehavior: "auto !important",
    },
  },
};

const components = {
  ".container-site": {
    marginLeft: "auto",
    marginRight: "auto",
    width: "100%",
    maxWidth: "var(--lsl-max-site)",
    paddingLeft: "1rem",
    paddingRight: "1rem",
    "@media (min-width: 640px)": { paddingLeft: "1.5rem", paddingRight: "1.5rem" },
    "@media (min-width: 1024px)": { paddingLeft: "2.5rem", paddingRight: "2.5rem" },
  },
  ".eyebrow": {
    fontFamily: "var(--lsl-font-display)",
    fontSize: "var(--lsl-type-eyebrow)",
    fontWeight: "600",
    lineHeight: "1.4",
    letterSpacing: "0.18em",
    textTransform: "uppercase",
    color: c("fg-2"),
  },
  ".label-caps": {
    fontFamily: "var(--lsl-font-body)",
    fontSize: "var(--lsl-type-label)",
    fontWeight: "600",
    lineHeight: "1.4",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
  },
  ".display-1": { fontFamily: "var(--lsl-font-display)", fontWeight: "700", fontSize: "var(--lsl-type-display)", lineHeight: "1.02", letterSpacing: "-0.025em" },
  ".heading-1": { fontFamily: "var(--lsl-font-display)", fontWeight: "700", fontSize: "var(--lsl-type-h1)", lineHeight: "1.06", letterSpacing: "-0.02em" },
  ".heading-2": { fontFamily: "var(--lsl-font-display)", fontWeight: "600", fontSize: "var(--lsl-type-h2)", lineHeight: "1.15", letterSpacing: "-0.01em" },
  ".heading-3": { fontFamily: "var(--lsl-font-display)", fontWeight: "600", fontSize: "var(--lsl-type-h3)", lineHeight: "1.25", letterSpacing: "-0.005em" },
  ".lead": { fontSize: "var(--lsl-type-lead)", lineHeight: "1.55", color: c("fg-2") },
  ".link-u": {
    fontWeight: "600",
    color: c("fg"),
    textDecorationLine: "underline",
    textDecorationColor: c("butter"),
    textDecorationThickness: "2px",
    textUnderlineOffset: "4px",
    transition: `text-decoration-thickness var(--lsl-dur-fast) ease`,
    "&:hover": { textDecorationThickness: "5px" },
  },
  ".grid-ruled": {
    borderTop: `2px solid ${c("line")}`,
    borderLeft: `2px solid ${c("line")}`,
    "& > *": { borderBottom: `2px solid ${c("line")}`, borderRight: `2px solid ${c("line")}` },
  },
  ".skip-link": {
    position: "absolute",
    left: "1rem",
    top: "0",
    zIndex: "100",
    transform: "translateY(-100%)",
    background: c("ink"),
    color: c("paper"),
    padding: "0.75rem 1rem",
    fontSize: "var(--lsl-type-label)",
    fontWeight: "600",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    "&:focus": { transform: "translateY(1rem)" },
  },
};

const surfaces = (vars) => ({
  ".surface-paper": { ...vars.paper, backgroundColor: c("surface"), color: c("fg") },
  ".surface-alt": { ...vars.alt, backgroundColor: c("surface"), color: c("fg") },
  ".surface-ink": { ...vars.ink, backgroundColor: c("surface"), color: c("fg") },
});

const motion = {
  ".lsl-rise": { animation: `lsl-rise var(--lsl-dur-slow) ${EASE} backwards` },
  ".lsl-in-tl": { animation: `lsl-in-tl 0.7s ${EASE} 0.1s backwards` },
  ".lsl-in-br": { animation: `lsl-in-br 0.7s ${EASE} 0.3s backwards` },
  ".lsl-fade": { animation: `lsl-fade 0.5s ease 0.75s backwards` },
  ".lsl-draw": { strokeDasharray: "1", animation: `lsl-draw 0.9s ease-in-out 0.8s backwards` },
  ".lsl-reveal-ready .lsl-reveal": {
    transition: `opacity var(--lsl-dur-slow) ${EASE}, transform var(--lsl-dur-slow) ${EASE}`,
  },
  ".lsl-reveal-ready .lsl-reveal:not(.is-in)": { opacity: "0", transform: "translateY(16px)" },
  "@media (prefers-reduced-motion: reduce)": {
    ".lsl-reveal-ready .lsl-reveal:not(.is-in)": { opacity: "1", transform: "none" },
  },
};

const keyframes = {
  "lsl-rise": { from: { opacity: "0", transform: "translateY(18px)" }, to: { opacity: "1", transform: "none" } },
  "lsl-in-tl": { from: { opacity: "0", transform: "translate(-14px, -14px)" }, to: { opacity: "1", transform: "none" } },
  "lsl-in-br": { from: { opacity: "0", transform: "translate(14px, 14px)" }, to: { opacity: "1", transform: "none" } },
  "lsl-fade": { from: { opacity: "0" }, to: { opacity: "1" } },
  "lsl-draw": { from: { strokeDashoffset: "1" }, to: { strokeDashoffset: "0" } },
  "lsl-pulse": { "0%, 100%": { opacity: "1" }, "50%": { opacity: "0.55" } },
  "lsl-indeterminate": { from: { transform: "translateX(-100%)" }, to: { transform: "translateX(250%)" } },
  "accordion-down": { from: { height: "0" }, to: { height: "var(--radix-accordion-content-height)" } },
  "accordion-up": { from: { height: "var(--radix-accordion-content-height)" }, to: { height: "0" } },
};

module.exports = { base, components, surfaces, motion, keyframes };
