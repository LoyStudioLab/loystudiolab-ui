import foundation from "@registry/foundation.meta.js"
import ui from "@registry/ui.meta.js"
import lsl from "@registry/lsl.meta.js"
export { RULES } from "@registry/rules.js"
export { INTENTS } from "@registry/intents.js"

export const ITEMS = [...foundation, ...ui, ...lsl]
export const CATEGORY_ORDER = ["foundation", "brand", "layout", "typography", "actions", "forms", "navigation", "data-display", "feedback", "overlays", "motion", "hooks"]
export const CATEGORY_LABEL = {
  foundation: "Foundation",
  brand: "Brand",
  layout: "Layout",
  typography: "Typography",
  actions: "Actions",
  forms: "Forms",
  navigation: "Navigation",
  "data-display": "Data display",
  feedback: "Feedback",
  overlays: "Overlays",
  motion: "Motion",
  hooks: "Hooks and lib",
}
export const byCategory = () => {
  const map = {}
  for (const it of ITEMS) (map[it.category] ??= []).push(it)
  return CATEGORY_ORDER.filter((c) => map[c]).map((c) => [c, map[c]])
}
