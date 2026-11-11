// Renders every docs example for every registry item and runs axe on it.
// Color contrast is checked separately (jsdom has no layout or computed colors):
// see scripts/check-contrast.mjs and the Playwright axe pass.
import { describe, it, expect } from "vitest"
import { render } from "@testing-library/react"
import axe from "axe-core"

import { EXAMPLES } from "@docs/examples"
import { Example } from "@docs/components/Docs"
import { TooltipProvider } from "@/components/ui/tooltip"

const run = async (container) => {
  const res = await axe.run(container, {
    rules: { "color-contrast": { enabled: false }, region: { enabled: false } },
  })
  return res.violations.map((v) => `${v.id}: ${v.help} (${v.nodes.map((n) => n.target.join(" ")).join(", ")})`)
}

describe("examples pass axe", () => {
  for (const [name, list] of Object.entries(EXAMPLES)) {
    for (const ex of list) {
      it(`${name} · ${ex.title}`, async () => {
        const { container } = render(
          <TooltipProvider>
            <main>
              <h1>{name}</h1>
              <h2>Examples</h2>
              <Example title={ex.title} surface={ex.surface}>{ex.render()}</Example>
            </main>
          </TooltipProvider>
        )
        expect(await run(container)).toEqual([])
      })
    }
  }
})
