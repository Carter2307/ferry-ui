import * as React from 'react'
import { Popover as PopoverPrimitive } from 'radix-ui'

import { cn } from '../../lib/utils'

/**
 * Root of a popover (Radix Popover): a floating panel anchored to its trigger
 * that can hold interactive content. Uncontrolled with `defaultOpen`, or
 * controlled with `open` + `onOpenChange`. Non-modal by default: the page
 * stays interactive and clicking outside closes it.
 *
 * Use for small contextual forms and pickers (quick edit, filters, share
 * settings, date or color pickers). Do NOT use it for a list of commands (use
 * `DropdownMenu`), a read-only hint on hover (use `Tooltip`), or content
 * large or important enough to need focus (use `Dialog` / `Sheet`).
 */
function Popover(props: React.ComponentProps<typeof PopoverPrimitive.Root>) {
  return <PopoverPrimitive.Root data-slot="popover" {...props} />
}

/** Element that toggles the popover on click; use `asChild` with a `Button`. */
function PopoverTrigger(props: React.ComponentProps<typeof PopoverPrimitive.Trigger>) {
  return <PopoverPrimitive.Trigger data-slot="popover-trigger" {...props} />
}

/**
 * The floating panel, portaled into `document.body`: 288px wide, 16px
 * padding, 8px radius, strong border and overlay shadow. Positioned below the
 * trigger by default (`side`, `align`, default `center`, and `sideOffset`,
 * default 6px, adjust it) and flips automatically to stay on screen. Override
 * the width or padding with `className` (e.g. `w-80 p-0` for a list).
 */
function PopoverContent({
  className,
  align = 'center',
  sideOffset = 6,
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Content>) {
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        data-slot="popover-content"
        align={align}
        sideOffset={sideOffset}
        className={cn(
          'z-50 w-72 origin-(--radix-popover-content-transform-origin) rounded-lg border border-border-strong bg-popover p-4 text-popover-foreground shadow-overlay outline-hidden',
          'data-[side=bottom]:slide-in-from-top-1 data-[side=left]:slide-in-from-right-1 data-[side=right]:slide-in-from-left-1 data-[side=top]:slide-in-from-bottom-1 motion-safe:data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-[0.98] motion-safe:data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-[0.98]',
          className,
        )}
        {...props}
      />
    </PopoverPrimitive.Portal>
  )
}

/**
 * Positions the popover against an element other than the trigger (e.g. a
 * whole input group while the trigger is an icon inside it). Wrap the anchor
 * element with it, inside `Popover`.
 */
function PopoverAnchor(props: React.ComponentProps<typeof PopoverPrimitive.Anchor>) {
  return <PopoverPrimitive.Anchor data-slot="popover-anchor" {...props} />
}

/** Optional heading block at the top of `PopoverContent`: stacks `PopoverTitle` and `PopoverDescription`. */
function PopoverHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return <div data-slot="popover-header" className={cn('flex flex-col gap-1 text-sm', className)} {...props} />
}

/**
 * Visual title of the popover (14px, medium weight). It is a plain `div`, not
 * wired to ARIA: give `PopoverContent` an `aria-label` when the content needs
 * an accessible name.
 */
function PopoverTitle({ className, ...props }: React.ComponentProps<'div'>) {
  return <div data-slot="popover-title" className={cn('text-sm font-medium text-foreground', className)} {...props} />
}

/** Short helper text under `PopoverTitle` (13px, muted). */
function PopoverDescription({ className, ...props }: React.ComponentProps<'p'>) {
  return <p data-slot="popover-description" className={cn('text-[13px] text-foreground-light', className)} {...props} />
}

export { Popover, PopoverTrigger, PopoverContent, PopoverAnchor, PopoverHeader, PopoverTitle, PopoverDescription }
