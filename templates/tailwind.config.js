/** @type {import('tailwindcss').Config} */
// LoyStudioLab: all tokens, base styles and components come from the preset.
// Installed by @lsl/foundation. Add app-specific extensions under `theme.extend` only.
// CommonJS on purpose: Tailwind 3 loads it in both "type": "module" and CommonJS apps,
// and tailwind.config.js wins over a leftover tailwind.config.cjs (delete that one).
module.exports = {
  presets: [require("./src/styles/lsl-preset.cjs")],
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
}
