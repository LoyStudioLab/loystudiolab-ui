// @lsl/use-document-title · managed by loystudiolab-ui · change upstream, not here.
import { useEffect } from "react"

// Sets "<title> · LoyStudioLab" (or just the site name when title is empty).
export function useDocumentTitle(title, site = "LoyStudioLab") {
  useEffect(() => {
    document.title = title ? `${title} · ${site}` : site
  }, [title, site])
}
