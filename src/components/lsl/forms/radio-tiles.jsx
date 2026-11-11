// @lsl/radio-tiles · managed by loystudiolab-ui · change upstream, not here.
import * as React from "react"
import * as RadioGroup from "@radix-ui/react-radio-group"

import { FieldError } from "@/components/lsl/forms/field"
import { cn } from "@/lib/utils"

/*
  A one-of-few choice drawn as ruled tiles. The selected tile inverts to ink.
  Use for 2 to 4 options that each need a short hint; use Select for more.
  options: [{ value, label, hint? }]
*/
export function RadioTiles({ legend, options, value, onValueChange, onBlur, error, required = false, name, className }) {
  const base = React.useId().replace(/:/g, "")
  const legendId = `rt${base}-legend`
  const errorId = error ? `rt${base}-error` : undefined
  return (
    <fieldset className={className} aria-describedby={errorId}>
      <legend id={legendId} className="font-body text-xs font-semibold uppercase tracking-[0.08em] text-fg">
        {legend}
        {required && <span aria-hidden="true"> *</span>}
      </legend>
      <RadioGroup.Root
        name={name}
        value={value ?? ""}
        onValueChange={onValueChange}
        onBlur={onBlur}
        aria-labelledby={legendId}
        aria-required={required ? "true" : undefined}
        aria-invalid={error ? "true" : "false"}
        className={cn(
          "mt-2 grid border-2 border-line",
          options.length === 2 ? "sm:grid-cols-2" : options.length === 3 ? "sm:grid-cols-3" : "sm:grid-cols-2",
          error && "border-danger"
        )}
      >
        {options.map((o, i) => {
          const id = `rt${base}-${i}`
          return (
            <RadioGroup.Item
              key={o.value}
              value={o.value}
              id={id}
              aria-labelledby={`${id}-label`}
              aria-describedby={o.hint ? `${id}-hint` : undefined}
              className="group flex min-h-11 items-start gap-3 border-t-2 border-line bg-surface p-4 text-left text-fg transition-colors duration-fast first:border-t-0 hover:bg-tint data-[state=checked]:bg-ink data-[state=checked]:text-paper sm:border-l-2 sm:border-t-0 sm:first:border-l-0"
            >
              <span className="mt-0.5 grid size-4 shrink-0 place-items-center border-2 border-current">
                <RadioGroup.Indicator className="size-1.5 bg-current" />
              </span>
              <span>
                <span id={`${id}-label`} className="block font-semibold">
                  {o.label ?? o.value}
                </span>
                {o.hint && (
                  <span id={`${id}-hint`} className="mt-1 block text-sm opacity-80">
                    {o.hint}
                  </span>
                )}
              </span>
            </RadioGroup.Item>
          )
        })}
      </RadioGroup.Root>
      <FieldError id={errorId} message={error} />
    </fieldset>
  )
}
