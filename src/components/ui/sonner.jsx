// @lsl/sonner · managed by loystudiolab-ui · change upstream, not here.
import { Toaster as Sonner } from "sonner"

import { StatusIcon } from "@/components/lsl/feedback/status-icon"

// Toasts: ink box on paper, square status marks (rule S3), no shadow, no radius.
const Toaster = (props) => (
  <Sonner
    className="toaster group"
    icons={{
      success: <StatusIcon status="success" />,
      info: <StatusIcon status="info" />,
      warning: <StatusIcon status="warning" />,
      error: <StatusIcon status="error" />,
    }}
    toastOptions={{
      unstyled: true,
      classNames: {
        toast:
          "flex w-full items-start gap-3 border-2 border-ink bg-paper p-4 font-body text-sm text-ink [&[data-type=error]_svg]:text-brick-deep",
        title: "font-semibold",
        description: "mt-1 text-ink-2",
        actionButton: "ml-auto border-2 border-ink bg-ink px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.06em] text-paper",
        cancelButton: "border-2 border-ink px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.06em]",
      },
    }}
    {...props}
  />
)

export { Toaster }
