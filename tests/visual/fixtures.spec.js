import { test, expect } from "@playwright/test"
import AxeBuilder from "@axe-core/playwright"

import foundation from "../../registry/foundation.meta.js"
import ui from "../../registry/ui.meta.js"
import lsl from "../../registry/lsl.meta.js"
import { useLocalFonts } from "./fonts.js"

// Items with visual examples (hooks and scripts have none).
const NO_VISUAL = new Set(["doctor", "accent-budget", "section-nav", "use-document-title", "use-reduced-motion", "field-context"])
const names = [...foundation, ...ui, ...lsl].map((i) => i.name).filter((n) => !NO_VISUAL.has(n))
const WIDTHS = [375, 768, 1280]

test.beforeEach(async ({ page }) => {
  await useLocalFonts(page)
})

for (const name of names) {
  test.describe(name, () => {
    test(`axe in the browser (incl. color contrast) · ${name}`, async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 900 })
      await page.goto(`/fixture/${name}`)
      await page.evaluate(() => document.fonts.ready)
      const results = await new AxeBuilder({ page })
        // Examples render page-level landmarks (header, footer) inside the fixture's main.
        .disableRules(["landmark-banner-is-top-level", "landmark-contentinfo-is-top-level", "landmark-no-duplicate-banner", "landmark-no-duplicate-contentinfo", "landmark-unique", "region"])
        .analyze()
      expect(results.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(", ")}`)).toEqual([])
    })

    test(`no horizontal scroll at 375px · ${name}`, async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 800 })
      await page.goto(`/fixture/${name}`)
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)
      expect(overflow).toBeLessThanOrEqual(0)
    })

    for (const width of WIDTHS) {
      test(`@visual ${name} at ${width}`, async ({ page }) => {
        await page.setViewportSize({ width, height: 900 })
        await page.goto(`/fixture/${name}`)
        await page.evaluate(() => document.fonts.ready)
        await expect(page).toHaveScreenshot(`${name}-${width}.png`, { fullPage: true })
      })
    }
  })
}

test("keyboard: Tab reaches a visible dual focus ring", async ({ page }) => {
  await page.goto("/fixture/button")
  await page.keyboard.press("Tab")
  const ring = await page.evaluate(() => {
    const el = document.activeElement
    const cs = getComputedStyle(el)
    return { outline: cs.outlineStyle, width: cs.outlineWidth, shadow: cs.boxShadow }
  })
  expect(ring.outline).toBe("solid")
  expect(ring.width).toBe("3px")
  expect(ring.shadow).toContain("255, 180, 0")
})

test("keyboard: RadioTiles moves with arrow keys", async ({ page }) => {
  await page.goto("/fixture/radio-tiles")
  await page.waitForLoadState("networkidle")
  const first = page.getByRole("radio", { name: "New project" }).first()
  await expect(first).toBeChecked()
  await first.focus()
  await expect(first).toBeFocused()
  await page.keyboard.press("ArrowDown")
  await expect(page.getByRole("radio", { name: "Collaboration" }).first()).toBeChecked()
})

test("keyboard: Escape closes the sheet and returns focus", async ({ page }) => {
  await page.goto("/fixture/sheet")
  const trigger = page.getByRole("button", { name: "Open panel" })
  await trigger.click()
  await expect(page.getByRole("dialog")).toBeVisible()
  await page.keyboard.press("Escape")
  await expect(page.getByRole("dialog")).toBeHidden()
  await expect(trigger).toBeFocused()
})

// Docs pages themselves: no horizontal scroll on a phone, and axe-clean.
for (const path of ["/", "/foundations", "/components", "/components/button", "/components/field", "/rules", "/agents"]) {
  test(`docs page ${path}: fits 375px and passes axe`, async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 800 })
    await page.goto(path)
    await page.evaluate(() => document.fonts.ready)
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)
    expect(overflow).toBeLessThanOrEqual(0)
    const results = await new AxeBuilder({ page }).analyze()
    expect(results.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(", ")}`)).toEqual([])
  })
}
