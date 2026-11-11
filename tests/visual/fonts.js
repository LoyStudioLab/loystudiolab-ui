// Serve Jost and Archivo from @fontsource during tests instead of Google Fonts, so
// screenshots are stable offline. Apps themselves always use the Google Fonts <link> (T3).
import { fileURLToPath } from "node:url"

const nm = fileURLToPath(new URL("../../node_modules/", import.meta.url))
const face = (family, pkg, weight) =>
  `@font-face{font-family:"${family}";font-style:normal;font-weight:${weight};font-display:block;src:url(http://127.0.0.1:5198/@fs${nm}@fontsource/${pkg}/files/${pkg}-latin-${weight}-normal.woff2) format("woff2");}`
const CSS = [
  ...[500, 600, 700].map((w) => face("Jost", "jost", w)),
  ...[400, 500, 600, 700].map((w) => face("Archivo", "archivo", w)),
].join("\n")

export async function useLocalFonts(page) {
  await page.route("https://fonts.googleapis.com/**", (route) => route.fulfill({ status: 200, contentType: "text/css", body: CSS }))
  await page.route("https://fonts.gstatic.com/**", (route) => route.abort())
}
