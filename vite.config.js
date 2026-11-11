import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import { fileURLToPath } from "node:url"

// Docs site: built with the library itself. `@` points at the library source, exactly
// as it does inside a consuming app.
export default defineConfig({
  root: "docs",
  base: process.env.LSL_BASE ?? "/",
  plugins: [react()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      "@docs": fileURLToPath(new URL("./docs/src", import.meta.url)),
      "@registry": fileURLToPath(new URL("./registry", import.meta.url)),
    },
  },
  build: { outDir: "../dist", emptyOutDir: true },
  server: { port: 5199, strictPort: true },
})
