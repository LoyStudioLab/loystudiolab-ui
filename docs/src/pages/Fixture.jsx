// Bare example page for one item (no header/footer). Used by visual regression and axe.
import { useParams } from "react-router-dom"

import { useDocumentTitle } from "@/hooks/use-document-title"
import { EXAMPLES } from "@docs/examples"
import { Example } from "@docs/components/Docs"

export default function Fixture() {
  const { name } = useParams()
  useDocumentTitle(`Fixture ${name}`, "LoyStudioLab UI")
  const examples = EXAMPLES[name] ?? []
  return (
    <main id="main" className="surface-paper min-h-screen space-y-6 p-4 sm:p-8" aria-label={`${name} examples`}>
      <h1 className="sr-only">{name}</h1>
      <h2 className="sr-only">Examples</h2>
      {examples.map((ex) => (
        <Example key={ex.title} title={ex.title} surface={ex.surface}>
          {ex.render()}
        </Example>
      ))}
      {!examples.length && <p>No visual examples for {name}.</p>}
    </main>
  )
}
