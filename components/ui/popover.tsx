"use client"

import * as React from "react"
import * as PopoverPrimitive from "@radix-ui/react-popover"

import { cn } from "@/lib/utils"

/**
 * Wraps Radix's PopoverPrimitive.Root with a `data-slot="popover"` attribute.
 *
 * @returns A React element rendering `PopoverPrimitive.Root` with `data-slot="popover"` and the provided props
 */
function Popover({
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Root>) {
  return <PopoverPrimitive.Root data-slot="popover" {...props} />
}

/**
 * Renders a popover trigger element with a data-slot of "popover-trigger" and forwards received props to the underlying trigger element.
 *
 * @param props - All props accepted by the popover trigger; forwarded to the rendered element.
 * @returns A React element for the popover trigger.
 */
function PopoverTrigger({
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Trigger>) {
  return <PopoverPrimitive.Trigger data-slot="popover-trigger" {...props} />
}

/**
 * Renders the popover content with sensible defaults and composed styling.
 *
 * The component mounts the content into a portal, applies default alignment and side offset,
 * and merges any provided `className` with the component's base styles.
 *
 * @param className - Additional CSS classes to append to the component's default styling
 * @param align - Alignment of the popover relative to its trigger; defaults to `"center"`
 * @param sideOffset - Distance in pixels between the popover and its trigger; defaults to `4`
 * @returns A PopoverPrimitive.Content element rendered inside a Portal
 */
function PopoverContent({
  className,
  align = "center",
  sideOffset = 4,
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Content>) {
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        data-slot="popover-content"
        align={align}
        sideOffset={sideOffset}
        className={cn(
          "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-72 origin-(--radix-popover-content-transform-origin) rounded-md border p-4 shadow-md outline-hidden",
          className
        )}
        {...props}
      />
    </PopoverPrimitive.Portal>
  )
}

/**
 * Renders a popover anchor element with a data-slot of "popover-anchor" and forwards received props.
 *
 * @returns The rendered React element for PopoverPrimitive.Anchor.
 */
function PopoverAnchor({
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Anchor>) {
  return <PopoverPrimitive.Anchor data-slot="popover-anchor" {...props} />
}

export { Popover, PopoverTrigger, PopoverContent, PopoverAnchor }