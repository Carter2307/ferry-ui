import * as React from 'react'
import { XIcon } from 'lucide-react'
import { Dialog as SheetPrimitive } from 'radix-ui'

import { cn } from '../../lib/utils'

/**
 * Root of a sheet: a modal panel that slides in from an edge of the screen
 * (Radix Dialog). Uncontrolled with `defaultOpen`, or controlled with `open` +
 * `onOpenChange`.
 *
 * Use for secondary work that benefits from keeping the page in view: detail
 * panels, filters, long edit forms, the mobile navigation drawer. Do NOT use
 * it for short blocking questions (use `Dialog` or `AlertDialog`) or for small
 * menus anchored to a trigger (use `Popover` / `DropdownMenu`).
 */
function Sheet(props: React.ComponentProps<typeof SheetPrimitive.Root>) {
  return <SheetPrimitive.Root data-slot="sheet" {...props} />
}

/** Element that opens the sheet on click; use `asChild` with a `Button`. */
function SheetTrigger(props: React.ComponentProps<typeof SheetPrimitive.Trigger>) {
  return <SheetPrimitive.Trigger data-slot="sheet-trigger" {...props} />
}

/**
 * Closes the sheet on click. Wrap a footer button or a navigation link with
 * `asChild` so the drawer closes after the choice. The top-right close icon
 * of `SheetContent` is built in.
 */
function SheetClose(props: React.ComponentProps<typeof SheetPrimitive.Close>) {
  return <SheetPrimitive.Close data-slot="sheet-close" {...props} />
}

/** Portals its children into `document.body`. Internal to `SheetContent`. */
function SheetPortal(props: React.ComponentProps<typeof SheetPrimitive.Portal>) {
  return <SheetPrimitive.Portal data-slot="sheet-portal" {...props} />
}

/** Dimmed backdrop behind the sheet. Internal to `SheetContent`. */
function SheetOverlay({ className, ...props }: React.ComponentProps<typeof SheetPrimitive.Overlay>) {
  return (
    <SheetPrimitive.Overlay
      data-slot="sheet-overlay"
      className={cn(
        'fixed inset-0 z-50 bg-overlay motion-safe:data-[state=closed]:animate-out data-[state=closed]:fade-out-0 motion-safe:data-[state=open]:animate-in data-[state=open]:fade-in-0',
        className,
      )}
      {...props}
    />
  )
}

/** Props of {@link SheetContent}: every Radix `Dialog.Content` prop plus the options below. */
type SheetContentProps = React.ComponentProps<typeof SheetPrimitive.Content> & {
  /**
   * Edge the panel slides in from. `right` (default) for detail and edit
   * panels, `left` for navigation drawers, `bottom` for mobile action sheets,
   * `top` rarely (announcements, search).
   */
  side?: 'top' | 'right' | 'bottom' | 'left'
  /** Renders the top-right close (X) button. Default `true`; when `false`, give the footer a way out. */
  showCloseButton?: boolean
  /** Accessible name of the built-in close (X) button. Default `"Close"`; pass a translation in localized apps. */
  closeLabel?: string
}

/**
 * The sliding panel: portal + overlay + a full-height (left/right) or
 * auto-height (top/bottom) flex column on the page background, with a
 * built-in close button in the top-right corner.
 *
 * Left/right sheets are 75% of the viewport wide, capped at 384px from the
 * `sm` breakpoint; widen them with `className` (e.g. `sm:max-w-lg`). Compose
 * `SheetHeader`, `SheetBody` (fills the height and scrolls) and
 * `SheetFooter` (sticks to the bottom). Always render a `SheetTitle`; without
 * a `SheetDescription`, pass `aria-describedby={undefined}`.
 */
function SheetContent({
  className,
  children,
  side = 'right',
  showCloseButton = true,
  closeLabel = 'Close',
  ...props
}: SheetContentProps) {
  return (
    <SheetPortal>
      <SheetOverlay />
      <SheetPrimitive.Content
        data-slot="sheet-content"
        className={cn(
          'fixed z-50 flex flex-col bg-background shadow-overlay transition ease-in-out motion-safe:data-[state=closed]:animate-out data-[state=closed]:duration-200 motion-safe:data-[state=open]:animate-in data-[state=open]:duration-300',
          side === 'right' &&
            'inset-y-0 right-0 h-full w-3/4 border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm',
          side === 'left' &&
            'inset-y-0 left-0 h-full w-3/4 border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm',
          side === 'top' &&
            'inset-x-0 top-0 h-auto border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top',
          side === 'bottom' &&
            'inset-x-0 bottom-0 h-auto border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom',
          className,
        )}
        {...props}
      >
        {children}
        {showCloseButton && (
          <SheetPrimitive.Close
            data-slot="sheet-close"
            className="absolute top-3 right-3 inline-flex size-7 cursor-pointer items-center justify-center rounded-md text-foreground-lighter transition-colors outline-none hover:bg-surface-200 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none"
          >
            <XIcon className="size-4" />
            <span className="sr-only">{closeLabel}</span>
          </SheetPrimitive.Close>
        )}
      </SheetPrimitive.Content>
    </SheetPortal>
  )
}

/**
 * Top section of `SheetContent`: stacks `SheetTitle` and `SheetDescription`
 * above a bottom border, with right padding that clears the close button.
 */
function SheetHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="sheet-header"
      className={cn('flex flex-col gap-1 border-b px-4 py-3.5 pr-12', className)}
      {...props}
    />
  )
}

/**
 * Main section of `SheetContent`: padded column (16px gap) that takes the
 * remaining height and is the only part that scrolls, so `SheetHeader` and
 * `SheetFooter` stay in place. Use `className="gap-0 p-0"` for edge-to-edge
 * lists.
 */
function SheetBody({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div data-slot="sheet-body" className={cn('flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto p-4', className)} {...props} />
  )
}

/**
 * Bottom section of `SheetContent` (top border), pushed to the bottom of the
 * panel. Children stack full width by default; add
 * `className="flex-row justify-end"` for an inline action bar.
 */
function SheetFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="sheet-footer"
      className={cn('mt-auto flex flex-col gap-2 border-t p-4', className)}
      {...props}
    />
  )
}

/** Accessible title of the sheet (15px, medium weight). Required inside `SheetContent`. */
function SheetTitle({ className, ...props }: React.ComponentProps<typeof SheetPrimitive.Title>) {
  return (
    <SheetPrimitive.Title
      data-slot="sheet-title"
      className={cn('text-[15px] font-medium text-foreground', className)}
      {...props}
    />
  )
}

/** Short explanation under the title (13px, muted), announced by screen readers. */
function SheetDescription({ className, ...props }: React.ComponentProps<typeof SheetPrimitive.Description>) {
  return (
    <SheetPrimitive.Description
      data-slot="sheet-description"
      className={cn('text-[13px] text-foreground-light', className)}
      {...props}
    />
  )
}

export {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetBody,
  SheetFooter,
  SheetTitle,
  SheetDescription,
  type SheetContentProps,
}
