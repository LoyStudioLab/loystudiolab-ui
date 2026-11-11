import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom"

import { SiteShell } from "@/components/lsl/navigation/site-shell"
import { SiteFooter } from "@/components/lsl/navigation/site-footer"
import { AccentBudget } from "@/components/lsl/dev/accent-budget"
import { Toaster } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { DocsHeader } from "@docs/components/DocsHeader"
import Home from "@docs/pages/Home"
import Foundations from "@docs/pages/Foundations"
import Components, { ComponentIndex } from "@docs/pages/Components"
import Rules from "@docs/pages/Rules"
import Agents from "@docs/pages/Agents"
import Fixture from "@docs/pages/Fixture"
import NotFoundPage from "@docs/pages/NotFoundPage"

function DocsLayout() {
  return (
    <SiteShell
      header={<DocsHeader />}
      footer={
        <SiteFooter
          tagline="The LoyStudioLab component library. Tokens, components and rules for the studio's own sites and Lab products."
          links={[
            { label: "Principles", href: "/" },
            { label: "Foundations", href: "/foundations" },
            { label: "Components", href: "/components" },
            { label: "Rules", href: "/rules" },
            { label: "For agents", href: "/agents" },
          ]}
          note="Built with the library it documents."
        />
      }
    >
      <Outlet />
    </SiteShell>
  )
}

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, "")}>
      <TooltipProvider>
        <AccentBudget />
        <Toaster />
        <Routes>
          {/* Bare example pages for visual regression and axe (no header/footer). */}
          <Route path="/fixture/:name" element={<Fixture />} />
          <Route element={<DocsLayout />}>
            <Route index element={<Home />} />
            <Route path="foundations" element={<Foundations />} />
            <Route path="components" element={<ComponentIndex />} />
            <Route path="components/:name" element={<Components />} />
            <Route path="rules" element={<Rules />} />
            <Route path="agents" element={<Agents />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </TooltipProvider>
    </BrowserRouter>
  )
}
