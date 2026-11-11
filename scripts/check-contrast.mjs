// Fails (exit 1) if any text or UI pair the system allows drops below WCAG AA.
// Text: 4.5:1. UI boundaries and focus indicators (WCAG 1.4.11): 3:1.
import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const T = JSON.parse(readFileSync(resolve(root, "tokens/tokens.json"), "utf8"));
const C = Object.fromEntries(Object.entries(T.color).filter(([k]) => !k.startsWith("$")).map(([k, v]) => [k, v.$value]));

const lum = (hex) => {
  const ch = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * ch[0] + 0.7152 * ch[1] + 0.0722 * ch[2];
};
export const ratio = (a, b) => {
  const [x, y] = [lum(a), lum(b)];
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
};

const checks = [];
for (const [name, s] of Object.entries(T.surface)) {
  if (name.startsWith("$")) continue;
  const bg = C[s.bg];
  for (const role of ["fg", "fg-2", "danger", "loy", "signal-fg"]) checks.push({ what: `${role} text on ${name}`, fg: C[s[role]], bg, min: 4.5 });
  checks.push({ what: `border on ${name}`, fg: C[s.border], bg, min: 3 });
  checks.push({ what: `focus outline on ${name}`, fg: C[s["focus-outer"]], bg, min: 3 });
}
// Fixed component pairs
const fixed = [
  ["paper", "ink", "Button default (paper on ink)"],
  ["ink", "butter", "Button accent (ink on butter)"],
  ["butter", "ink", "Button accent hover (butter on ink)"],
  ["paper", "brick", "Button destructive (paper on brick)"],
  ["paper", "petrol", "Loy tag (paper on petrol)"],
  ["ink", "signal", "Signal fill with ink text"],
  ["paper", "ink-2", "Paper text on ink-2 hover tint"],
];
for (const [fg, bg, what] of fixed) checks.push({ what, fg: C[fg], bg: C[bg], min: 4.5 });

let failed = 0;
for (const c of checks) {
  const r = ratio(c.fg, c.bg);
  const ok = r >= c.min;
  if (!ok) failed++;
  console.log(`${ok ? "pass" : "FAIL"}  ${r.toFixed(2).padStart(5)} (min ${c.min})  ${c.what}`);
}
if (failed) {
  console.error(`\n${failed} contrast pair(s) below WCAG AA. Fix tokens/tokens.json.`);
  process.exit(1);
}
console.log(`\nAll ${checks.length} pairs pass.`);
