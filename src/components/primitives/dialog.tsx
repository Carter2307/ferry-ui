import * as React from 'react'
import { XIcon } from 'lucide-react'
import { Dialog as DialogPrimitive } from 'radix-ui'

import { cn } from '../../lib/utils'

/**
 * Root of a modal dialog (Radix Dialog). Holds the open state: leave it
 * uncontrolled (`defaultOpen`) or control it with `open` + `onOpenChange`.
 *
 * Use for focused tasks that need the user's full attention without leaving
 * the page: forms, settings, previews. Do NOT use it to confirm a destructive
 * or irreversible action (use `AlertDialog`, which cannot be dismissed by
 * clicking outside), for secondary content that should keep the page visible
 * (use `Sheet`), or for small contextual controls anchored to a trigger (use
 * `Popover`).
 */
function Dialog(props: React.ComponentProps<typeof DialogPrimitive.Root>) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />
}

/**
 * Element that opens the dialog on click. Pass `asChild` to reuse your own
 * `Button` instead of rendering an extra `<button>`. Optional when the dialog
 * is controlled with `open`.
 */
function DialogTrigger(props: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />
}

/**
 * Portals its children into `document.body`. Already used by `DialogContent`;
 * only reach for it when building a custom content wrapper.
 */
function DialogPortal(props: React.ComponentProps<typeof DialogPrimitive.Portal>) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />
}

/**
 * Closes the dialog on click. Wrap a footer button with `asChild` (e.g. a
 * "Cancel" button). The top-right close icon of `DialogContent` is built in.
 */
function DialogClose(props: React.ComponentProps<typeof DialogPrimitive.Close>) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />
}

/**
 * Dimmed, slightly blurred backdrop behind the dialog. Already rendered by
 * `DialogContent`; only use it directly in a custom content wrapper.
 */
function DialogOverlay({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
  return (
    <DialogPrimitive.Overlay
      data-slot="dialog-overlay"
      className={cn(
        'fixed inset-0 z-50 bg-overlay backdrop-blur-[1px] motion-safe:data-[state=closed]:animate-out data-[state=closed]:fade-out-0 motion-safe:data-[state=open]:animate-in data-[state=open]:fade-in-0',
        className,
      )}
      {...props}
    />
  )
}

const dialogSizes = {
  sm: 'sm:max-w-sm',
  md: 'sm:max-w-md',
  lg: 'sm:max-w-lg',
  xl: 'sm:max-w-2xl',
  xxl: 'sm:max-w-4xl',
} as const

/** Props of {@link DialogContent}: every Radix `Dialog.Content` prop plus the options below. */
type DialogContentProps = React.ComponentProps<typeof DialogPrimitive.Content> & {
  /**
   * Max width from the `sm` breakpoint up (on phones the panel is full width
   * with a 1rem gutter on each side): `sm` 384px, `md` 448px (default, simple
   * forms), `lg` 512px, `xl` 672px (multi-column forms), `xxl` 896px (tables,
   * previews).
   */
  size?: keyof typeof dialogSizes
  /** Renders the top-right close (X) button. Default `true`; when `false`, give the footer a way out. */
  showCloseButton?: boolean
  /** Accessible name of the built-in close (X) button. Default `"Close"`; pass a translation in localized apps. */
  closeLabel?: string
}

/**
 * The dialog panel: portal + overlay + a centered, bordered card (8px radius)
 * with a built-in close button in the top-right corner. It is a flex column
 * capped at the viewport height, so compose it as three stacked sections:
 * `DialogHeader` (title + description, bottom border), `DialogBody` (the only
 * scrolling part) and `DialogFooter` (top border, actions on the right).
 *
 * To submit with Enter, wrap the three sections in a single
 * `<form className="flex min-h-0 flex-col">` (the classes keep `DialogBody`
 * scrolling). Always render a `DialogTitle` inside (required for screen
 * readers). Without a `DialogDescription`, pass `aria-describedby={undefined}`.
 */
function DialogContent({
  className,
  children,
  size = 'md',
  showCloseButton = true,
  closeLabel = 'Close',
  ...props
}: DialogContentProps) {
  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Content
        data-slot="dialog-content"
        className={cn(
          'fixed top-[50%] left-[50%] z-50 flex max-h-[calc(100dvh-2rem)] w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] flex-col overflow-hidden rounded-lg border border-border-strong bg-popover text-popover-foreground shadow-overlay outline-none',
          'duration-150 motion-safe:data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-[0.98] motion-safe:data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-[0.98]',
          dialogSizes[size],
          className,
        )}
        {...props}
      >
        {children}
        {showCloseButton && (
          <DialogPrimitive.Close
            data-slot="dialog-close"
            className="absolute top-3.5 right-3.5 inline-flex size-6 cursor-pointer items-center justify-center rounded-md text-foreground-lighter transition-colors outline-none hover:bg-surface-200 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none"
          >
            <XIcon className="size-4" />
            <span className="sr-only">{closeLabel}</span>
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Content>
    </DialogPortal>
  )
}

/**
 * Top section of `DialogContent`: stacks `DialogTitle` and
 * `DialogDescription` above a bottom border. Its extra right padding keeps the
 * title clear of the built-in close button.
 */
function DialogHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="dialog-header"
      className={cn('flex shrink-0 flex-col gap-1 border-b px-5 py-4 pr-12', className)}
      {...props}
    />
  )
}

/**
 * Main section of `DialogContent`: padded column with a 16px gap between
 * children. It is the only part that scrolls when the content is taller than
 * the viewport, so header and footer stay visible.
 */
function DialogBody({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div data-slot="dialog-body" className={cn('flex min-h-0 flex-col gap-4 overflow-y-auto px-5 py-5', className)} {...props} />
  )
}

/**
 * Bottom action bar of `DialogContent` (top border). Buttons are right-aligned
 * from the `sm` breakpoint and stacked full width on phones, with the last
 * child on top: put the secondary action (Cancel) first and the primary
 * action last.
 */
function DialogFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn('flex shrink-0 flex-col-reverse gap-2 border-t px-5 py-3 sm:flex-row sm:items-center sm:justify-end', className)}
      {...props}
    />
  )
}

/** Accessible title of the dialog (16px, medium weight). Required inside `DialogContent`. */
function DialogTitle({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn('text-base leading-snug font-medium text-foreground', className)}
      {...props}
    />
  )
}

/**
 * One-sentence explanation under the title (13px, muted), announced by
 * screen readers when the dialog opens. Keep longer copy in `DialogBody`.
 */
function DialogDescription({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn('text-[13px] text-foreground-light', className)}
      {...props}
    />
  )
}

export {
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
  type DialogContentProps,
}
