import { SiteHeader } from "@/components/lsl/navigation/site-header"

export function DocsHeader() {
  return (
    <SiteHeader
      items={[
        { label: "Foundations", href: "/foundations" },
        { label: "Components", href: "/components" },
        { label: "Rules", href: "/rules" },
        { label: "For agents", href: "/agents" },
      ]}
      showLegend
    />
  )
}
