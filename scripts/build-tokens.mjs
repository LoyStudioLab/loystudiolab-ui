// Generates every token output from tokens/tokens.json:
//   src/styles/lsl-preset.cjs   Tailwind preset + plugin (installed into apps by @lsl/foundation)
//   src/lib/lsl-tokens.js       plain values for SVG, charts, docs
//   docs/public/tokens.css      standalone CSS variables (for artifacts, emails, non-Tailwind pages)
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(import.meta.url);
const T = JSON.parse(readFileSync(resolve(root, "tokens/tokens.json"), "utf8"));
const styles = require(resolve(root, "tokens/base-styles.cjs"));
const { version } = JSON.parse(readFileSync(resolve(root, "package.json"), "utf8"));

const colors = Object.fromEntries(
  Object.entries(T.color).filter(([k]) => !k.startsWith("$")).map(([k, v]) => [k, v.$value])
);
const rgb = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16)).join(" ");
const hsl = (hex) => {
  let [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    h = max === r ? (g - b) / d + (g < b ? 6 : 0) : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
    h /= 6;
  }
  return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
};

// Contextual variables per surface (component code reads only these).
const surfaceVars = {};
for (const [name, map] of Object.entries(T.surface)) {
  if (name.startsWith("$")) continue;
  const c = (k) => colors[map[k]];
  surfaceVars[name] = {
    "--lsl-surface": rgb(c("bg")),
    "--lsl-fg": rgb(c("fg")),
    "--lsl-fg-2": rgb(c("fg-2")),
    "--lsl-line": rgb(c("border")),
    "--lsl-divider": rgb(c("divider")),
    "--lsl-focus-inner": rgb(c("focus-inner")),
    "--lsl-focus-outer": rgb(c("focus-outer")),
    "--lsl-danger": rgb(c("danger")),
    "--lsl-loy": rgb(c("loy")),
    "--lsl-signal-fg": rgb(c("signal-fg")),
    "--lsl-tint": rgb(c("hover")),
    // shadcn/ui variables, so stock-API primitives follow the surface too.
    "--background": hsl(c("bg")),
    "--foreground": hsl(c("fg")),
    "--card": hsl(c("bg")),
    "--card-foreground": hsl(c("fg")),
    "--popover": hsl(c("bg")),
    "--popover-foreground": hsl(c("fg")),
    "--primary": hsl(c("fg")),
    "--primary-foreground": hsl(c("bg")),
    "--secondary": hsl(c("hover")),
    "--secondary-foreground": hsl(c("fg")),
    "--muted": hsl(c("hover")),
    "--muted-foreground": hsl(c("fg-2")),
    "--accent": hsl(c("hover")),
    "--accent-foreground": hsl(c("fg")),
    "--destructive": hsl(c("danger")),
    "--destructive-foreground": hsl(c("bg")),
    "--border": hsl(c("border")),
    "--input": hsl(c("border")),
    "--ring": hsl(c("focus-outer")),
  };
}

const ease = `cubic-bezier(${T.motion.easing.standard.$value.join(", ")})`;
const rootVars = {
  ...Object.fromEntries(Object.entries(colors).map(([k, v]) => [`--lsl-${k}`, rgb(v)])),
  ...surfaceVars.paper,
  "--lsl-font-display": T.font.display.$value.map((f) => (f.includes("-") ? f : `"${f}"`)).join(", "),
  "--lsl-font-body": T.font.body.$value.map((f) => (f.includes("-") ? f : `"${f}"`)).join(", "),
  ...Object.fromEntries(Object.entries(T.type).filter(([k]) => !k.startsWith("$")).map(([k, v]) => [`--lsl-type-${k}`, v.size])),
  "--lsl-dur-fast": T.motion.duration.fast.$value,
  "--lsl-dur-base": T.motion.duration.base.$value,
  "--lsl-dur-slow": T.motion.duration.slow.$value,
  "--lsl-ease": ease,
  "--lsl-max-site": T.layout.maxWidth.site,
  "--lsl-header-h": T.layout.headerHeight.base,
  "--radius": "0px",
};

const twColor = (name) => `rgb(var(--lsl-${name}) / <alpha-value>)`;
const preset = {
  darkMode: ["class"],
  theme: {
    screens: T.layout.screens,
    extend: {
      colors: {
        paper: { DEFAULT: twColor("paper"), alt: twColor("paper-alt") },
        ink: { DEFAULT: twColor("ink"), 2: twColor("ink-2") },
        concrete: twColor("concrete"),
        rule: twColor("rule"),
        butter: twColor("butter"),
        petrol: { DEFAULT: twColor("petrol"), light: twColor("petrol-light") },
        brick: { DEFAULT: twColor("brick"), deep: twColor("brick-deep"), light: twColor("brick-light") },
        ochre: twColor("ochre"),
        signal: { DEFAULT: twColor("signal"), ink: twColor("signal-ink") },
        // Contextual (follow the surface): use these in components.
        surface: twColor("surface"),
        fg: { DEFAULT: twColor("fg"), 2: twColor("fg-2") },
        line: twColor("line"),
        divider: twColor("divider"),
        danger: twColor("danger"),
        loy: twColor("loy"),
        "signal-fg": twColor("signal-fg"),
        tint: twColor("tint"),
        // shadcn/ui names
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: { DEFAULT: "hsl(var(--card))", foreground: "hsl(var(--card-foreground))" },
        popover: { DEFAULT: "hsl(var(--popover))", foreground: "hsl(var(--popover-foreground))" },
        primary: { DEFAULT: "hsl(var(--primary))", foreground: "hsl(var(--primary-foreground))" },
        secondary: { DEFAULT: "hsl(var(--secondary))", foreground: "hsl(var(--secondary-foreground))" },
        muted: { DEFAULT: "hsl(var(--muted))", foreground: "hsl(var(--muted-foreground))" },
        accent: { DEFAULT: "hsl(var(--accent))", foreground: "hsl(var(--accent-foreground))" },
        destructive: { DEFAULT: "hsl(var(--destructive))", foreground: "hsl(var(--destructive-foreground))" },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
      },
      borderRadius: { none: "0px", sm: "0px", DEFAULT: "0px", md: "0px", lg: "0px", xl: "0px", "2xl": "0px", "3xl": "0px", full: "0px" },
      borderWidth: { DEFAULT: "2px", 3: "3px" },
      boxShadow: { sm: "none", DEFAULT: "none", md: "none", lg: "none", xl: "none", "2xl": "none", inner: "none" },
      fontFamily: {
        display: ["var(--lsl-font-display)"],
        heading: ["var(--lsl-font-display)"],
        body: ["var(--lsl-font-body)"],
        sans: ["var(--lsl-font-body)"],
      },
      maxWidth: { site: T.layout.maxWidth.site, prose: T.layout.maxWidth.prose },
      transitionTimingFunction: { lsl: ease },
      transitionDuration: { fast: T.motion.duration.fast.$value, base: T.motion.duration.base.$value, slow: T.motion.duration.slow.$value },
      zIndex: Object.fromEntries(Object.entries(T.z).map(([k, v]) => [k, String(v)])),
      keyframes: styles.keyframes,
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "lsl-pulse": "lsl-pulse 1.6s ease-in-out infinite",
        "lsl-indeterminate": "lsl-indeterminate 1.4s ease-in-out infinite",
      },
    },
  },
};

const header = `/*
  @lsl/foundation ${version} · managed by loystudiolab-ui · change upstream, not here.
  GENERATED by scripts/build-tokens.mjs from tokens/tokens.json. Do not edit by hand.

  LoyStudioLab Tailwind preset: Palette B "Warm Studio". Paper dominates, Ink carries
  structure, Butter is the single accent. 2px borders, radius 0, no shadows, no gradients.
  Use in tailwind.config.cjs:  presets: [require("./src/styles/lsl-preset.cjs")]
*/
`;
const file = `${header}
const plugin = require("tailwindcss/plugin");
const animate = require("tailwindcss-animate");

const ROOT_VARS = ${JSON.stringify(rootVars, null, 2)};
const SURFACE_VARS = ${JSON.stringify(surfaceVars, null, 2)};
const BASE = ${JSON.stringify(styles.base, null, 2)};
// Surfaces and motion are always emitted (base layer): their class names are often
// built at runtime (surface-\${name}, lsl-reveal-ready), which Tailwind cannot see.
const ALWAYS = ${JSON.stringify({ ...styles.surfaces(surfaceVars), ...styles.motion }, null, 2)};
const COMPONENTS = ${JSON.stringify(styles.components, null, 2)};

const preset = ${JSON.stringify(preset, null, 2)};

preset.plugins = [
  animate,
  plugin(function lsl({ addBase, addComponents }) {
    addBase({ ":root": ROOT_VARS, "@media (min-width: 1024px)": { ":root": { "--lsl-header-h": "${T.layout.headerHeight.lg}" } } });
    addBase(BASE);
    addBase(ALWAYS);
    addComponents(COMPONENTS);
  }),
];
preset.lslVersion = "${version}";
preset.lslSurfaces = SURFACE_VARS;

module.exports = preset;
`;
mkdirSync(resolve(root, "src/styles"), { recursive: true });
writeFileSync(resolve(root, "src/styles/lsl-preset.cjs"), file);

const js = `// @lsl/tokens ${version} · managed by loystudiolab-ui · change upstream, not here.
// GENERATED from tokens/tokens.json. Plain values for SVG, charts and docs.
export const colors = ${JSON.stringify(colors, null, 2)};
export const surfaces = ${JSON.stringify(Object.fromEntries(Object.entries(T.surface).filter(([k]) => !k.startsWith("$"))), null, 2)};
export const type = ${JSON.stringify(Object.fromEntries(Object.entries(T.type).filter(([k]) => !k.startsWith("$"))), null, 2)};
export const motion = { fast: 150, base: 250, slow: 550, ease: "${ease}" };
export const fontLink = "${T.fontLink.$value}";
`;
writeFileSync(resolve(root, "src/lib/lsl-tokens.js"), js);

const css = `/* LoyStudioLab tokens ${version}. GENERATED from tokens/tokens.json. */
:root {
${Object.entries(colors).map(([k, v]) => `  --${k}: ${v};`).join("\n")}
  --font-display: ${rootVars["--lsl-font-display"]};
  --font-body: ${rootVars["--lsl-font-body"]};
${Object.entries(T.type).filter(([k]) => !k.startsWith("$")).map(([k, v]) => `  --type-${k}: ${v.size};`).join("\n")}
  --ease: ${ease};
  --border: 2px solid var(--ink);
  --radius: 0;
}
`;
mkdirSync(resolve(root, "docs/public"), { recursive: true });
writeFileSync(resolve(root, "docs/public/tokens.css"), css);
console.log(`tokens ${version}: preset, lsl-tokens.js and tokens.css written`);
