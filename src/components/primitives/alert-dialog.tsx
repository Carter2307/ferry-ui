import * as React from 'react'
import { Loader2 } from 'lucide-react'
import { AlertDialog as AlertDialogPrimitive } from 'radix-ui'

import { Button, type ButtonProps } from './button'
import { cn } from '../../lib/utils'

/**
 * Root of a confirmation dialog (Radix AlertDialog). Unlike `Dialog`, it
 * cannot be dismissed by clicking outside and has no close icon: the user must
 * pick `AlertDialogCancel` or `AlertDialogAction` (Escape still cancels).
 *
 * Use it to confirm destructive or irreversible actions (delete, revoke,
 * discard unsaved changes). Do NOT use it for forms or any content the user
 * interacts with beyond the two choices (use `Dialog`), nor for plain
 * notifications (use a toast).
 */
function AlertDialog(props: React.ComponentProps<typeof AlertDialogPrimitive.Root>) {
  return <AlertDialogPrimitive.Root data-slot="alert-dialog" {...props} />
}

/** Element that opens the confirmation on click; use `asChild` with a `Button`. */
function AlertDialogTrigger(props: React.ComponentProps<typeof AlertDialogPrimitive.Trigger>) {
  return <AlertDialogPrimitive.Trigger data-slot="alert-dialog-trigger" {...props} />
}

/**
 * Portals its children into `document.body`. Already used by
 * `AlertDialogContent`; only needed for a custom content wrapper.
 */
function AlertDialogPortal(props: React.ComponentProps<typeof AlertDialogPrimitive.Portal>) {
  return <AlertDialogPrimitive.Portal data-slot="alert-dialog-portal" {...props} />
}

/**
 * Dimmed, slightly blurred backdrop. Already rendered by `AlertDialogContent`;
 * only use it directly in a custom content wrapper.
 */
function AlertDialogOverlay({ className, ...props }: React.ComponentProps<typeof AlertDialogPrimitive.Overlay>) {
  return (
    <AlertDialogPrimitive.Overlay
      data-slot="alert-dialog-overlay"
      className={cn(
        'fixed inset-0 z-50 bg-overlay backdrop-blur-[1px] motion-safe:data-[state=closed]:animate-out data-[state=closed]:fade-out-0 motion-safe:data-[state=open]:animate-in data-[state=open]:fade-in-0',
        className,
      )}
      {...props}
    />
  )
}

/**
 * The confirmation panel: portal + overlay + a centered card, 448px wide from
 * the `sm` breakpoint (full width minus gutters on phones), same look as
 * `DialogContent`. Compose it with `AlertDialogHeader`, an optional
 * `AlertDialogBody` and `AlertDialogFooter`. Always include an
 * `AlertDialogTitle` and an `AlertDialogDescription` (both are announced).
 */
function AlertDialogContent({ className, ...props }: React.ComponentProps<typeof AlertDialogPrimitive.Content>) {
  return (
    <AlertDialogPortal>
      <AlertDialogOverlay />
      <AlertDialogPrimitive.Content
        data-slot="alert-dialog-content"
        className={cn(
          'fixed top-[50%] left-[50%] z-50 flex max-h-[calc(100dvh-2rem)] w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] flex-col overflow-hidden rounded-lg border border-border-strong bg-popover text-popover-foreground shadow-overlay outline-none sm:max-w-md',
          'duration-150 motion-safe:data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-[0.98] motion-safe:data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-[0.98]',
          className,
        )}
        {...props}
      />
    </AlertDialogPortal>
  )
}

/** Top section: stacks `AlertDialogTitle` and `AlertDialogDescription` above a bottom border. */
function AlertDialogHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return <div data-slot="alert-dialog-header" className={cn('flex flex-col gap-1 border-b px-5 py-4', className)} {...props} />
}

/**
 * Optional middle section for consequences the description cannot hold: a
 * list of affected items, a warning callout, a "type the name to confirm"
 * field. Scrolls when too tall.
 */
function AlertDialogBody({ className, ...props }: React.ComponentProps<'div'>) {
  return <div data-slot="alert-dialog-body" className={cn('flex flex-col gap-4 overflow-y-auto px-5 py-5', className)} {...props} />
}

/**
 * Bottom action bar (top border). Right-aligned from the `sm` breakpoint and
 * stacked full width on phones with the last child on top: render
 * `AlertDialogCancel` first and `AlertDialogAction` last.
 */
function AlertDialogFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="alert-dialog-footer"
      className={cn('flex flex-col-reverse gap-2 border-t px-5 py-3 sm:flex-row sm:items-center sm:justify-end', className)}
      {...props}
    />
  )
}

/** Accessible title, phrased as a question ("Delete this project?"). Required. */
function AlertDialogTitle({ className, ...props }: React.ComponentProps<typeof AlertDialogPrimitive.Title>) {
  return (
    <AlertDialogPrimitive.Title
      data-slot="alert-dialog-title"
      className={cn('text-base leading-snug font-medium text-foreground', className)}
      {...props}
    />
  )
}

/** States the consequence ("This cannot be undone."). Required for screen readers. */
function AlertDialogDescription({ className, ...props }: React.ComponentProps<typeof AlertDialogPrimitive.Description>) {
  return (
    <AlertDialogPrimitive.Description
      data-slot="alert-dialog-description"
      className={cn('text-sm text-foreground-light', className)}
      {...props}
    />
  )
}

/** Props of {@link AlertDialogAction}: every Radix `AlertDialog.Action` prop plus Button's look. */
type AlertDialogActionProps = React.ComponentProps<typeof AlertDialogPrimitive.Action> &
  Pick<ButtonProps, 'variant' | 'size'> & {
    /**
     * Shows a spinner before the label, disables the button and sets
     * `aria-busy`, like `Button`'s `loading`. Clicking still closes the dialog
     * unless `onClick` calls `event.preventDefault()`, so pair it with a
     * controlled `open` for async actions.
     */
    loading?: boolean
  }

/**
 * Confirm button: runs `onClick`, then closes the dialog. Rendered as a
 * `Button` (default `variant="primary"`, `size="sm"`); pass
 * `variant="destructive-solid"` for destructive confirmations. To keep the dialog
 * open while an async action runs, control `open` on `AlertDialog`, call
 * `event.preventDefault()` in `onClick` and set `loading` until it settles.
 */
function AlertDialogAction({
  className,
  variant = 'primary',
  size = 'sm',
  loading = false,
  disabled,
  children,
  ...props
}: AlertDialogActionProps) {
  return (
    <Button variant={variant} size={size} className={className} asChild>
      <AlertDialogPrimitive.Action
        data-slot="alert-dialog-action"
        disabled={disabled || loading}
        aria-busy={loading || undefined}
        {...props}
      >
        {/* With `asChild` the single child element must be passed through untouched. */}
        {loading && !props.asChild ? (
          <>
            <Loader2 className="animate-spin" aria-hidden="true" />
            {children}
          </>
        ) : (
          children
        )}
      </AlertDialogPrimitive.Action>
    </Button>
  )
}

/** Props of {@link AlertDialogCancel}: every Radix `AlertDialog.Cancel` prop plus Button's look. */
type AlertDialogCancelProps = React.ComponentProps<typeof AlertDialogPrimitive.Cancel> &
  Pick<ButtonProps, 'variant' | 'size'>

/**
 * Dismiss button: closes the dialog without acting. Rendered as a `Button`
 * (default `variant="default"`, `size="sm"`) and focused first when the
 * dialog opens, so Enter never confirms by accident. Disable it while an
 * async action is pending.
 */
function AlertDialogCancel({ className, variant = 'default', size = 'sm', ...props }: AlertDialogCancelProps) {
  return (
    <Button variant={variant} size={size} className={className} asChild>
      <AlertDialogPrimitive.Cancel data-slot="alert-dialog-cancel" {...props} />
    </Button>
  )
}

export {
  AlertDialog,
  AlertDialogAction,
  AlertDialogBody,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  AlertDialogPortal,
  AlertDialogTitle,
  AlertDialogTrigger,
  type AlertDialogActionProps,
  type AlertDialogCancelProps,
}
