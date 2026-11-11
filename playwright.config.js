import { defineConfig, devices } from "@playwright/test"

// Visual regression (@visual, baselines committed per platform) and browser axe passes
// against the docs fixture pages. CI runs everything except @visual unless baselines for
// its platform exist (see .github/workflows/ci.yml).
export default defineConfig({
  testDir: "tests/visual",
  fullyParallel: true,
  retries: 1,
  reporter: [["list"]],
  snapshotPathTemplate: "{testDir}/__screenshots__/{platform}/{arg}{ext}",
  expect: { toHaveScreenshot: { maxDiffPixelRatio: 0.002, animations: "disabled" } },
  use: { baseURL: "http://127.0.0.1:5198", ...devices["Desktop Chrome"], reducedMotion: "reduce" },
  webServer: {
    command: "npx vite --port 5198 --strictPort --host 127.0.0.1",
    url: "http://127.0.0.1:5198",
    reuseExistingServer: true,
    timeout: 60000,
  },
})
