import * as React from 'react'
import { Tooltip as TooltipPrimitive } from 'radix-ui'

import { cn } from '../../lib/utils'

/**
 * Shares hover delays between tooltips (250ms before the first one opens, then instant while the
 * pointer moves between triggers). Mount it once near the app root: every Tooltip and Hint must
 * have a provider above it. Nest a second provider only to change the timing of one area (e.g.
 * `delayDuration={0}` for a dense toolbar).
 */
function TooltipProvider({ delayDuration = 250, ...props }: React.ComponentProps<typeof TooltipPrimitive.Provider>) {
  return <TooltipPrimitive.Provider data-slot="tooltip-provider" delayDuration={delayDuration} {...props} />
}

/**
 * Root of a tooltip: a short, non-essential text label shown on hover and keyboard focus.
 * Use it for icon-only buttons, truncated text and small hints. Do NOT put interactive content or
 * information the user needs in it (touch users cannot hover): use Popover or inline text instead.
 * For the common case prefer `Hint`; use these parts for controlled `open`, custom delays or
 * content props.
 */
function Tooltip(props: React.ComponentProps<typeof TooltipPrimitive.Root>) {
  return <TooltipPrimitive.Root data-slot="tooltip" {...props} />
}

/**
 * The element that shows the tooltip on hover and focus. Use `asChild` with a focusable element
 * (button, link) so keyboard users can reach the tooltip too.
 */
function TooltipTrigger(props: React.ComponentProps<typeof TooltipPrimitive.Trigger>) {
  return <TooltipPrimitive.Trigger data-slot="tooltip-trigger" {...props} />
}

/**
 * The tooltip bubble: raised popover surface, strong 1px border, 6px radius, 12px text, no arrow.
 * Portaled and placed 6px from the trigger; position it with `side` / `align`. Wraps (balanced)
 * past 20rem, but keep the text to a few words.
 */
function TooltipContent({
  className,
  sideOffset = 6,
  children,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Content>) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        data-slot="tooltip-content"
        sideOffset={sideOffset}
        className={cn(
          'z-50 w-fit max-w-xs origin-(--radix-tooltip-content-transform-origin) rounded-md border border-border-strong bg-popover px-2 py-1 text-xs text-balance text-foreground shadow-overlay',
          'motion-safe:animate-in fade-in-0 zoom-in-[0.98] motion-safe:data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-[0.98]',
          className,
        )}
        {...props}
      >
        {children}
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  )
}

/** Props of {@link Hint}. */
interface HintProps {
  /** Tooltip text; keep it to a few words. */
  label: React.ReactNode
  /** Preferred side of the trigger (default "top"); flips automatically when there is no room. */
  side?: React.ComponentProps<typeof TooltipPrimitive.Content>['side']
  /** The trigger: a single focusable element that forwards its ref. */
  children: React.ReactNode
}

/**
 * One-line tooltip for the common case: `<Hint label="Copy"><Button … /></Hint>`.
 * The child becomes the trigger (via `asChild`), so it must be a single focusable element that
 * forwards its ref (Button, a, …); to explain a disabled button, wrap it in a `<span tabIndex={0}>`
 * (disabled elements get no hover or focus). Always give icon-only buttons an `aria-label` as
 * well: the tooltip is a visual aid, not the accessible name. Use the full Tooltip parts when you
 * need controlled state, alignment or other content props.
 */
function Hint({ label, side, children }: HintProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent side={side}>{label}</TooltipContent>
    </Tooltip>
  )
}

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider, Hint, type HintProps }
