import { describe, it, expect, vi } from "vitest"
import { render, screen, act } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Field, FormSuccess } from "@/components/lsl/forms/field"
import { RadioTiles } from "@/components/lsl/forms/radio-tiles"
import { IconButton } from "@/components/lsl/actions/icon-button"
import { Heading } from "@/components/lsl/typography/typography"
import { StatusBadge } from "@/components/lsl/data-display/data-display"
import { LinearLoader } from "@/components/lsl/feedback/feedback"
import { Section } from "@/components/lsl/layout/layout"
import { AccentBudget } from "@/components/lsl/dev/accent-budget"
import { formatNOK, formatDate } from "@/lib/format"

describe("Button", () => {
  it("marks the accent variant for the C1 budget", () => {
    render(<Button variant="accent">Send</Button>)
    expect(screen.getByRole("button", { name: "Send" })).toHaveAttribute("data-lsl-accent")
  })
  it("does not mark other variants", () => {
    render(<Button>Send</Button>)
    expect(screen.getByRole("button")).not.toHaveAttribute("data-lsl-accent")
  })
})

describe("Field", () => {
  it("labels the control and links hint and error", () => {
    render(
      <Field label="Email" hint="We only use it to reply." error="Please add your email." required>
        <Input type="email" />
      </Field>
    )
    const input = screen.getByLabelText(/Email/)
    expect(input).toHaveAttribute("aria-invalid", "true")
    expect(input).toHaveAttribute("aria-required", "true")
    expect(input).toHaveAccessibleDescription(/We only use it to reply\. .*Please add your email\./)
  })
  it("is valid without an error", () => {
    render(<Field label="Name"><Input /></Field>)
    expect(screen.getByLabelText("Name")).toHaveAttribute("aria-invalid", "false")
  })
  it("FormSuccess focuses its heading", () => {
    render(<FormSuccess title="Thank you." />)
    expect(screen.getByRole("heading", { name: "Thank you." })).toHaveFocus()
  })
})

describe("RadioTiles", () => {
  it("selects a tile and names it from its label", async () => {
    // Arrow-key movement is Radix behaviour and is covered in the browser (Playwright).
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<RadioTiles legend="About" value="A" onValueChange={onChange} options={[{ value: "A" }, { value: "B", hint: "Second" }]} />)
    await user.click(screen.getByRole("radio", { name: "B" }))
    expect(onChange).toHaveBeenCalledWith("B")
    expect(screen.getByRole("radiogroup", { name: "About" })).toBeInTheDocument()
  })
})

describe("Select in Field", () => {
  it("gets the Field label and error", async () => {
    const { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } = await import("@/components/ui/select")
    render(
      <Field label="Topic" error="Choose a topic.">
        <Select>
          <SelectTrigger><SelectValue placeholder="Choose" /></SelectTrigger>
          <SelectContent><SelectItem value="a">A</SelectItem></SelectContent>
        </Select>
      </Field>
    )
    const trigger = screen.getByRole("combobox", { name: "Topic" })
    expect(trigger).toHaveAttribute("aria-invalid", "true")
    expect(trigger).toHaveAccessibleDescription(/Choose a topic\./)
  })
})

describe("IconButton", () => {
  it("uses the label as accessible name", () => {
    render(<IconButton label="Open menu"><svg aria-hidden="true" /></IconButton>)
    expect(screen.getByRole("button", { name: "Open menu" })).toBeInTheDocument()
  })
})

describe("Heading", () => {
  it("keeps level and size independent", () => {
    render(<Heading level={3} size={1}>Title</Heading>)
    const h = screen.getByRole("heading", { level: 3 })
    expect(h.className).toContain("heading-1")
  })
})

describe("Status and progress", () => {
  it("StatusBadge always has text", () => {
    render(<StatusBadge status="error" />)
    expect(screen.getByText("Needs attention")).toBeInTheDocument()
  })
  it("LinearLoader exposes progress", () => {
    render(<LinearLoader value={40} label="Uploading" />)
    expect(screen.getByRole("progressbar", { name: "Uploading" })).toHaveAttribute("aria-valuenow", "40")
  })
})

describe("Section", () => {
  it("uses literal surface classes Tailwind can see", () => {
    const { container } = render(<Section surface="ink">x</Section>)
    expect(container.firstChild.className).toContain("surface-ink")
  })
})

describe("AccentBudget", () => {
  it("warns when two accent CTAs are on screen", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {})
    act(() => {
      render(
        <>
          <AccentBudget />
          <Button variant="accent">One</Button>
          <Button variant="accent">Two</Button>
        </>
      )
    })
    expect(warn).toHaveBeenCalledWith(expect.stringContaining("[LSL-C1]"))
    warn.mockRestore()
  })
})

describe("format", () => {
  it("formats NOK the Norwegian way", () => {
    expect(formatNOK(2500).replace(/\s/g, " ")).toBe("2 500 kr")
  })
  it("formats dates in English", () => {
    expect(formatDate("2026-11-11")).toBe("11 November 2026")
  })
})
