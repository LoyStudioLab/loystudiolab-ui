// @lsl/card · managed by loystudiolab-ui · change upstream, not here.
import * as React from "react"

import { cn } from "@/lib/utils"

// A flat, 2px-ruled box. No radius, no shadow: one visual question per edge.
const Card = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex flex-col border-2 border-line bg-surface text-fg", className)} {...props} />
))
Card.displayName = "Card"

const CardHeader = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex flex-col gap-2 p-6 lg:p-8", className)} {...props} />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef(({ className, as: Tag = "h3", ...props }, ref) => (
  <Tag ref={ref} className={cn("heading-3", className)} {...props} />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef(({ className, ...props }, ref) => (
  <p ref={ref} className={cn("text-fg-2", className)} {...props} />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("px-6 pb-6 lg:px-8 lg:pb-8", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("mt-auto flex items-center gap-4 border-t-2 border-line px-6 py-4 lg:px-8", className)} {...props} />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
