// @lsl/field · managed by loystudiolab-ui · change upstream, not here.
import * as React from "react"

import { Label } from "@/components/ui/label"
import { StatusIcon } from "@/components/lsl/feedback/status-icon"
import { FieldContext } from "@/lib/field-context"
import { cn } from "@/lib/utils"

/*
  Field wires a label, hint, error and character count to one control (rule A5).
  Pass exactly one control as the child; Field adds id, aria-describedby,
  aria-invalid and aria-required to it (and publishes them via FieldContext for
  controls nested deeper, like SelectTrigger inside <Select>). Works with react-hook-form's register():
    <Field label="Email" error={errors.email?.message} required>
      <Input type="email" {...register("email")} />
    </Field>
*/
export function Field({ label, hint, error, required = false, optional = false, id, count, maxLength, className, children }) {
  const autoId = React.useId()
  const fieldId = id ?? `f${autoId.replace(/:/g, "")}`
  const hintId = hint ? `${fieldId}-hint` : null
  const errorId = error ? `${fieldId}-error` : null
  const countId = maxLength != null ? `${fieldId}-count` : null
  const child = React.Children.only(children)
  const describedBy = [child.props["aria-describedby"], hintId, errorId, countId].filter(Boolean).join(" ") || undefined

  const wiring = {
    id: fieldId,
    "aria-describedby": describedBy,
    "aria-invalid": error ? "true" : child.props["aria-invalid"] ?? "false",
    "aria-required": required ? "true" : undefined,
  }
  const control = React.cloneElement(child, wiring)

  return (
    <div className={cn("flex flex-col", className)}>
      <div className="flex items-baseline justify-between gap-4">
        <Label htmlFor={fieldId}>
          {label}
          {required && <span aria-hidden="true"> *</span>}
          {optional && <span className="font-normal normal-case tracking-normal text-fg-2"> (optional)</span>}
        </Label>
        {maxLength != null && (
          <span id={countId} className={cn("text-xs tabular-nums", (count ?? 0) > maxLength ? "font-semibold text-danger" : "text-fg-2")}>
            {count ?? 0} / {maxLength}
          </span>
        )}
      </div>
      {hint && (
        <p id={hintId} className="mt-1 text-sm text-fg-2">
          {hint}
        </p>
      )}
      <div className="mt-2">
        <FieldContext.Provider value={wiring}>{control}</FieldContext.Provider>
      </div>
      <FieldError id={errorId} message={error} />
    </div>
  )
}

export function FieldError({ id, message, className }) {
  if (!message) return null
  return (
    <p id={id} className={cn("mt-2 flex items-start gap-2 text-sm font-medium text-danger", className)}>
      <StatusIcon status="error" className="mt-0.5" />
      {message}
    </p>
  )
}

/*
  Form-level message. Receives focus when it appears (pass a ref and focus it), so
  screen-reader and keyboard users land on it. tone: error | success | info.
*/
export const FormAlert = React.forwardRef(function FormAlert({ tone = "error", title, children, className }, ref) {
  return (
    <div
      ref={ref}
      tabIndex={-1}
      role={tone === "error" ? "alert" : "status"}
      className={cn("flex gap-3 border-2 bg-surface p-4 focus:outline-none", tone === "error" ? "border-danger" : "border-line", className)}
    >
      <StatusIcon status={tone} className={cn("mt-0.5", tone === "error" && "text-danger")} />
      <div>
        {title && <p className={cn("font-semibold", tone === "error" ? "text-danger" : "text-fg")}>{title}</p>}
        {children && <div className="mt-1 text-sm text-fg-2">{children}</div>}
      </div>
    </div>
  )
})

// Replaces a form after a successful submit. The heading takes focus on mount.
export function FormSuccess({ title, children, action, className }) {
  const ref = React.useRef(null)
  React.useEffect(() => {
    ref.current?.focus()
  }, [])
  return (
    <div role="status" className={cn("flex flex-col gap-5", className)}>
      <StatusIcon status="success" size={48} />
      <h3 ref={ref} tabIndex={-1} className="heading-2 focus:outline-none">
        {title}
      </h3>
      {children && <div className="text-fg-2">{children}</div>}
      {action && <div>{action}</div>}
    </div>
  )
}

// Off-screen field that only bots fill. Pass react-hook-form's register("website").
export const Honeypot = React.forwardRef(function Honeypot({ name = "website", ...props }, ref) {
  return (
    <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
      <label htmlFor={`hp-${name}`}>Leave this empty</label>
      <input id={`hp-${name}`} ref={ref} name={name} tabIndex={-1} autoComplete="off" {...props} />
    </div>
  )
})
