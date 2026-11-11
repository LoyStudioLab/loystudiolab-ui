/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [require("./src/styles/lsl-preset.cjs")],
  content: ["./docs/index.html", "./docs/src/**/*.{js,jsx}", "./src/**/*.{js,jsx}"],
}
