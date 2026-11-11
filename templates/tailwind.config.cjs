/** @type {import('tailwindcss').Config} */
// LoyStudioLab: all tokens, base styles and components come from the preset.
// Installed by @lsl/foundation. Add app-specific extensions under `theme.extend` only.
module.exports = {
  presets: [require("./src/styles/lsl-preset.cjs")],
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
}
