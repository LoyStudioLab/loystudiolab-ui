// Tiny static server for docs/public (used by the smoke test and local registry installs).
import { createServer } from "node:http"
import { readFile } from "node:fs/promises"
import { resolve, extname, dirname } from "node:path"
import { fileURLToPath } from "node:url"

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../docs/public")
const types = { ".json": "application/json", ".txt": "text/plain", ".css": "text/css", ".html": "text/html" }

export function serve(port = 0) {
  return new Promise((ok) => {
    const server = createServer(async (req, res) => {
      try {
        const path = resolve(root, "." + decodeURIComponent(new URL(req.url, "http://x").pathname))
        if (!path.startsWith(root)) throw new Error("outside")
        const body = await readFile(path)
        res.writeHead(200, { "content-type": types[extname(path)] ?? "application/octet-stream" })
        res.end(body)
      } catch {
        res.writeHead(404)
        res.end("not found")
      }
    })
    server.listen(port, "127.0.0.1", () => ok(server))
  })
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const s = await serve(Number(process.argv[2] ?? 4873))
  console.log(`serving docs/public on http://127.0.0.1:${s.address().port}`)
}
