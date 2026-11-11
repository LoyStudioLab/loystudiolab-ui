import { Link } from "react-router-dom"

import { Section } from "@/components/lsl/layout/layout"
import { NotFound } from "@/components/lsl/feedback/feedback"
import { Button } from "@/components/ui/button"
import { useDocumentTitle } from "@/hooks/use-document-title"

export default function NotFoundPage() {
  useDocumentTitle("Not found", "LoyStudioLab UI")
  return (
    <Section bordered={false}>
      <NotFound action={<Button asChild variant="outline"><Link to="/">Go to the front page</Link></Button>} />
    </Section>
  )
}
