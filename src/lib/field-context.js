// @lsl/field-context · managed by loystudiolab-ui · change upstream, not here.
import { createContext, useContext } from "react"

/*
  Field publishes its wiring (id, aria-describedby, aria-invalid, aria-required) here,
  so controls that Field cannot clone directly (e.g. a Radix SelectTrigger nested inside
  <Select>) can pick it up.
*/
export const FieldContext = createContext(null)
export const useFieldContext = () => useContext(FieldContext)
