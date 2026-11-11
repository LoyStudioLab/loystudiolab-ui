// @lsl/format · managed by loystudiolab-ui · change upstream, not here.
/*
  Number and date formatting. Copy is English, but money and dates follow Norwegian
  conventions by default, since our users are in Norway.
*/
export function formatNOK(amount, { decimals = 0, locale = "nb-NO" } = {}) {
  if (amount == null || Number.isNaN(Number(amount))) return ""
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "NOK",
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(Number(amount))
}

export function formatNumber(value, { decimals = 0, locale = "nb-NO" } = {}) {
  if (value == null || Number.isNaN(Number(value))) return ""
  return new Intl.NumberFormat(locale, { minimumFractionDigits: decimals, maximumFractionDigits: decimals }).format(Number(value))
}

// style: "long" (11 November 2026), "short" (11 Nov 2026), "numeric" (11.11.2026)
export function formatDate(value, { style = "long", locale = "en-GB" } = {}) {
  if (!value) return ""
  const d = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(d.getTime())) return ""
  if (style === "numeric") return new Intl.DateTimeFormat("nb-NO", { day: "2-digit", month: "2-digit", year: "numeric" }).format(d)
  return new Intl.DateTimeFormat(locale, { day: "numeric", month: style === "short" ? "short" : "long", year: "numeric" }).format(d)
}
