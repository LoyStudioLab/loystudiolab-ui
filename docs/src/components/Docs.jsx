// Small docs-only building blocks, composed from the library.
import * as React from "react"
import { toast } from "sonner"
import { Copy } from "lucide-react"

import { IconButton } from "@/components/lsl/actions/icon-button"
import { cn } from "@/lib/utils"

// Scrollable regions are focusable so keyboard users can scroll them (axe: scrollable-region-focusable).
export function Code({ children, className, label = "Code example" }) {
  return (
    <pre tabIndex={0} aria-label={label} className={cn("docs-code", className)}>
      <code>{children}</code>
    </pre>
  )
}

export function CopyLine({ text, label = "Copy command" }) {
  return (
    <div className="flex items-stretch border-2 border-ink">
      <code tabIndex={0} className="flex-1 overflow-x-auto whitespace-nowrap bg-ink px-4 py-3 font-mono text-sm text-paper">{text}</code>
      <IconButton
        label={label}
        variant="ghost"
        className="h-auto border-0 border-l-2 border-ink"
        onClick={() => {
          navigator.clipboard?.writeText(text)
          toast.success("Copied")
        }}
      >
        <Copy aria-hidden="true" />
      </IconButton>
    </div>
  )
}

// Live example frame. `surface` shows the example on paper, paper-alt or ink.
export function Example({ title, surface = "paper", children }) {
  return (
    <figure className="border-2 border-ink">
      <figcaption className="flex items-center justify-between gap-4 border-b-2 border-ink bg-paper px-4 py-2">
        <span className="label-caps">{title}</span>
        <span className="label-caps text-ink-2">{surface}</span>
      </figcaption>
      <div className={cn(surface === "ink" ? "surface-ink" : surface === "alt" ? "surface-alt" : "surface-paper", "p-6 lg:p-8")}>{children}</div>
    </figure>
  )
}

export function PropsTable({ props, label = "Props" }) {
  if (!props?.length) return <p className="text-sm text-ink-2">No props beyond the native element&apos;s attributes.</p>
  return (
    <div tabIndex={0} role="region" aria-label={label} className="relative overflow-x-auto border-2 border-ink">
      <table className="w-full min-w-[36rem] border-collapse text-left text-sm">
        <thead className="bg-paper-alt">
          <tr>
            {["Prop", "Type", "Default", "Notes"].map((h) => (
              <th key={h} scope="col" className="border-b-2 border-ink px-4 py-2 label-caps">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {props.map((p) => (
            <tr key={p.name} className="border-t-2 border-rule first:border-t-0 align-top">
              <td className="px-4 py-3 font-mono text-[0.8125rem] font-semibold">
                {p.name}
                {p.required && <span className="ml-1 text-brick-deep">*</span>}
              </td>
              <td className="px-4 py-3 font-mono text-[0.8125rem] text-ink-2">{p.type}</td>
              <td className="px-4 py-3 font-mono text-[0.8125rem] text-ink-2">{p.default || ""}</td>
              <td className="px-4 py-3 text-ink-2">{p.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
