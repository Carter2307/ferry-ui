import * as React from "react"
import { cn } from "../../lib/utils"
import { ScrollArea as ScrollAreaPrimitive } from "radix-ui"

/** Props of {@link ScrollArea}: the Radix ScrollArea root props (`type`, `scrollHideDelay`, `dir`…) plus `viewportProps`. */
type ScrollAreaProps = React.ComponentProps<typeof ScrollAreaPrimitive.Root> & {
  /**
   * Props for the scrolling viewport element (its `className` is merged). When the
   * area holds no focusable content (plain text, a read-only list), make the
   * viewport itself focusable so it can be scrolled from the keyboard in every
   * browser: `viewportProps={{ tabIndex: 0, role: "region", "aria-label": "Activity" }}`.
   * Leave it unset when the content has links, buttons or fields.
   */
  viewportProps?: React.ComponentProps<typeof ScrollAreaPrimitive.Viewport>
}

/**
 * A scroll container with a thin, themed overlay scrollbar instead of the OS
 * one (shown while hovering by default; set `type="always"` to pin it): long
 * menus, side panels, logs, lists inside fixed-height cards.
 * Give it a bounded size (`h-72`, `max-h-80`, `flex-1 min-h-0`…) or it grows
 * with its content and never scrolls.
 *
 * Renders a vertical scrollbar; for horizontal scrolling add
 * `<ScrollBar orientation="horizontal" />` as the last child.
 *
 * Keyboard: when nothing inside can take focus, pass
 * `viewportProps={{ tabIndex: 0, role: "region", "aria-label": "…" }}` so the
 * viewport is a named, focusable region that arrow keys can scroll.
 *
 * Not needed for the main page scroll, or when a native scrollbar is fine.
 */
function ScrollArea({
  className,
  children,
  viewportProps,
  ...props
}: ScrollAreaProps) {
  return (
    <ScrollAreaPrimitive.Root
      data-slot="scroll-area"
      className={cn("relative", className)}
      {...props}
    >
      <ScrollAreaPrimitive.Viewport
        data-slot="scroll-area-viewport"
        {...viewportProps}
        className={cn(
          "size-full rounded-[inherit] outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset",
          viewportProps?.className
        )}
      >
        {children}
      </ScrollAreaPrimitive.Viewport>
      <ScrollBar />
      <ScrollAreaPrimitive.Corner />
    </ScrollAreaPrimitive.Root>
  )
}

/**
 * The themed scrollbar track + thumb. `ScrollArea` already renders the vertical
 * one; add `<ScrollBar orientation="horizontal" />` inside a `ScrollArea` for
 * horizontal scrolling.
 */
function ScrollBar({
  className,
  orientation = "vertical",
  ...props
}: React.ComponentProps<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>) {
  return (
    <ScrollAreaPrimitive.ScrollAreaScrollbar
      data-slot="scroll-area-scrollbar"
      orientation={orientation}
      className={cn(
        "flex touch-none p-px transition-colors select-none",
        orientation === "vertical" &&
          "h-full w-2.5 border-l border-l-transparent",
        orientation === "horizontal" &&
          "h-2.5 flex-col border-t border-t-transparent",
        className
      )}
      {...props}
    >
      <ScrollAreaPrimitive.ScrollAreaThumb
        data-slot="scroll-area-thumb"
        className="relative flex-1 rounded-full bg-border"
      />
    </ScrollAreaPrimitive.ScrollAreaScrollbar>
  )
}

export { ScrollArea, ScrollBar, type ScrollAreaProps }
