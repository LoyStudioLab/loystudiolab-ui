import react from "@vitejs/plugin-react"
import { defineConfig } from "vitest/config"
import { fileURLToPath } from "node:url"

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      "@docs": fileURLToPath(new URL("./docs/src", import.meta.url)),
      "@registry": fileURLToPath(new URL("./registry", import.meta.url)),
    },
  },
  test: {
    environment: "jsdom",
    include: ["tests/unit/**/*.test.{js,jsx}"],
    testTimeout: 20000,
    setupFiles: ["tests/unit/setup.js"],
    css: false,
  },
})
