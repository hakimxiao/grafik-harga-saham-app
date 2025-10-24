"use client"

import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"

import { cn } from "@/lib/utils"

/**
 * Render a styled Radix UI Label primitive with default layout and typography classes.
 *
 * @param className - Additional CSS class names to merge with the component's default classes.
 * @param props - All other props are forwarded to the underlying `LabelPrimitive.Root`.
 * @returns The rendered `LabelPrimitive.Root` element with `data-slot="label"` and a merged `className`.
 */
function Label({
  className,
  ...props
}: React.ComponentProps<typeof LabelPrimitive.Root>) {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={cn(
        "flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}

export { Label }