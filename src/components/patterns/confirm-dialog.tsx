import * as React from 'react'
import { AlertTriangle } from 'lucide-react'

import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../primitives/alert-dialog'
import { Button, type ButtonProps } from '../primitives/button'
import { Input } from '../primitives/input'
import { getErrorMessage } from '../../lib/errors'
import { cn } from '../../lib/utils'

/* -------------------------------------------------------------------------------------------------
 * ConfirmDialog
 * -----------------------------------------------------------------------------------------------*/

/**
 * Colour of the confirm button of a {@link ConfirmDialog}:
 * - `destructive` — solid red. Deleting, revoking, removing: anything that destroys data or access.
 * - `warning` — amber outline. Reversible but disruptive (pause, suspend, sign everyone out).
 * - `primary` — solid primary. Consequential but safe (send, publish, apply changes).
 */
export type ConfirmDialogTone = 'destructive' | 'warning' | 'primary'

const confirmVariant: Record<ConfirmDialogTone, NonNullable<ButtonProps['variant']>> = {
  destructive: 'destructive-solid',
  warning: 'warning',
  primary: 'primary',
}

/** Props of {@link ConfirmDialog}. */
export interface ConfirmDialogProps {
  /** Controlled open state. Pair it with `onOpenChange`; omit it (and use `defaultOpen` / `trigger`) for an uncontrolled dialog. */
  open?: boolean
  /** Initial open state when uncontrolled. */
  defaultOpen?: boolean
  /**
   * Called with the next open state: trigger click, Cancel, Escape, and `false` once `onConfirm` succeeds.
   * Never called while a confirmation is pending (the dialog cannot be dismissed mid-request).
   */
  onOpenChange?: (open: boolean) => void
  /**
   * Element that opens the dialog on click (rendered through `AlertDialogTrigger asChild`), usually a
   * `Button`. Omit it when the dialog is opened from elsewhere (a menu item, a row action) with `open`.
   */
  trigger?: React.ReactNode
  /** Title, phrased as a question naming the target ("Delete project “Marketing site”?"). */
  title: React.ReactNode
  /**
   * Consequences of the action ("This cannot be undone."). Announced as the dialog description. Rendered
   * in a flex column with an 8px gap, so several `<p>` stack nicely.
   */
  description?: React.ReactNode
  /** Label of the confirm button. Name the action ("Delete project"), not "OK". Defaults to "Confirm". */
  confirmLabel?: React.ReactNode
  /**
   * Label of the safe button. Defaults to "Cancel"; use e.g. "Keep editing" or "Keep subscription" when the
   * action itself is a cancellation, so the two buttons never both read "Cancel".
   */
  cancelLabel?: React.ReactNode
  /** Colour of the confirm button. Defaults to `destructive`. See {@link ConfirmDialogTone}. */
  tone?: ConfirmDialogTone
  /**
   * Typed confirmation: the confirm button stays disabled until the user types this exact text (usually
   * the name of the thing being destroyed). Reserve it for irreversible, high-impact actions — it is
   * friction by design.
   */
  confirmText?: string
  /**
   * Label above the typed-confirmation field. Defaults to `Type <confirmText> to confirm.` Override it to
   * translate the sentence (include the text to type yourself).
   */
  confirmTextLabel?: React.ReactNode
  /**
   * Runs the action. If it returns a promise (any thenable), the dialog shows a spinner on the confirm
   * button, cannot be dismissed while pending, closes when the promise resolves and shows the rejection
   * message inline (through `getErrorMessage`) when it rejects, so the user can retry. A synchronous throw
   * is shown the same way; any other return value is ignored and the dialog closes at once. On success the
   * dialog closes by itself: do not close it from `onConfirm`. Runs at most once per click, even on a
   * double-click.
   */
  onConfirm: () => unknown
  /** Extra content between the description and the typed-confirmation field (a checkbox, a warning callout, a list of affected items). */
  children?: React.ReactNode
  /** Classes merged onto the dialog panel (`AlertDialogContent`). */
  className?: string
}

function isPromiseLike(value: unknown): value is PromiseLike<unknown> {
  return (
    typeof value === 'object' && value !== null && typeof (value as { then?: unknown }).then === 'function'
  )
}

/**
 * Ready-made confirmation for destructive or impactful actions: title, consequences, optional extra
 * content, optional "type the name to confirm" field, and a Cancel / Confirm footer. Handles the async
 * part for you: spinner while `onConfirm` runs, no dismissal while pending, inline error on failure,
 * auto-close on success. State (typed text, error) is reset every time it opens.
 *
 * Use it for deletes, revocations, and any action that is hard to undo. Controlled (`open` +
 * `onOpenChange`, e.g. opened from a menu item) or uncontrolled (`trigger`, optional `defaultOpen`).
 *
 * Do NOT use it for forms or multi-step flows (use `Dialog`), for trivially undoable actions (just do
 * them and offer Undo in a toast), or when you need a custom layout (compose `AlertDialog` directly).
 */
export function ConfirmDialog({
  open,
  defaultOpen = false,
  onOpenChange,
  trigger,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  tone = 'destructive',
  confirmText,
  confirmTextLabel,
  onConfirm,
  children,
  className,
}: ConfirmDialogProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen)
  const [pending, setPending] = React.useState(false)
  const inputRef = React.useRef<HTMLInputElement>(null)

  const isControlled = open !== undefined
  const isOpen = isControlled ? open : uncontrolledOpen

  const setOpen = (next: boolean) => {
    if (!isControlled) setUncontrolledOpen(next)
    onOpenChange?.(next)
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={(next) => !pending && setOpen(next)}>
      {trigger != null && <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>}
      <AlertDialogContent
        className={className}
        // Without a description, tell Radix the dialog is intentionally undescribed.
        {...(description ? {} : { 'aria-describedby': undefined })}
        onOpenAutoFocus={(event) => {
          // Typed confirmation: start in the field. Otherwise Radix focuses Cancel (never the action).
          if (inputRef.current) {
            event.preventDefault()
            inputRef.current.focus()
          }
        }}
      >
        {/* Mounted only while open, so the typed text and the error start fresh on every open. */}
        <ConfirmDialogForm
          title={title}
          description={description}
          confirmLabel={confirmLabel}
          cancelLabel={cancelLabel}
          tone={tone}
          confirmText={confirmText}
          confirmTextLabel={confirmTextLabel}
          onConfirm={onConfirm}
          open={isOpen}
          pending={pending}
          onPendingChange={setPending}
          onDone={() => setOpen(false)}
          inputRef={inputRef}
        >
          {children}
        </ConfirmDialogForm>
      </AlertDialogContent>
    </AlertDialog>
  )
}

interface ConfirmDialogFormProps
  extends Pick<
    ConfirmDialogProps,
    'title' | 'description' | 'confirmLabel' | 'cancelLabel' | 'confirmText' | 'confirmTextLabel' | 'onConfirm' | 'children'
  > {
  tone: ConfirmDialogTone
  /** Whether the dialog is (still) open: false during the close animation, when the form must stop submitting. */
  open: boolean
  pending: boolean
  onPendingChange: (pending: boolean) => void
  onDone: () => void
  inputRef: React.Ref<HTMLInputElement>
}

function ConfirmDialogForm({
  title,
  description,
  confirmLabel,
  cancelLabel,
  tone,
  confirmText,
  confirmTextLabel,
  onConfirm,
  children,
  open,
  pending,
  onPendingChange,
  onDone,
  inputRef,
}: ConfirmDialogFormProps) {
  const [typed, setTyped] = React.useState('')
  const [error, setError] = React.useState<string | null>(null)
  // Guards the gap before `pending` re-renders (a double-click, a held Enter key).
  const runningRef = React.useRef(false)
  const inputId = React.useId()

  const matches = confirmText === undefined || typed === confirmText
  // Skip the padded body entirely when there is nothing to put in it (title-only confirmations).
  const hasBody =
    Boolean(description) ||
    React.Children.toArray(children).length > 0 ||
    confirmText !== undefined ||
    error !== null

  const run = async () => {
    // `open` is false while the panel animates out after a success: a second click must not re-run the action.
    if (!open || !matches || pending || runningRef.current) return
    runningRef.current = true
    setError(null)
    try {
      const result = onConfirm()
      if (isPromiseLike(result)) {
        onPendingChange(true)
        await result
      }
      onDone()
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      runningRef.current = false
      onPendingChange(false)
    }
  }

  return (
    <form
      data-slot="confirm-dialog"
      onSubmit={(event) => {
        event.preventDefault()
        void run()
      }}
      className="flex min-h-0 flex-col"
    >
      <AlertDialogHeader>
        <AlertDialogTitle>{title}</AlertDialogTitle>
      </AlertDialogHeader>
      {hasBody && (
        <AlertDialogBody>
          {description && (
            <AlertDialogDescription asChild>
              <div className="flex flex-col gap-2">{description}</div>
            </AlertDialogDescription>
          )}
          {children}
          {confirmText !== undefined && (
            <div data-slot="confirm-dialog-confirm-text" className="flex flex-col gap-2">
              <label htmlFor={inputId} className="text-[13px] text-foreground-light">
                {confirmTextLabel ?? (
                  <>
                    Type{' '}
                    <span className="font-mono font-medium break-words text-foreground select-all">{confirmText}</span> to
                    confirm.
                  </>
                )}
              </label>
              <Input
                ref={inputRef}
                id={inputId}
                mono
                autoComplete="off"
                autoCapitalize="off"
                spellCheck={false}
                value={typed}
                onChange={(event) => setTyped(event.target.value)}
                placeholder={confirmText}
              />
            </div>
          )}
          {error && (
            <div
              data-slot="confirm-dialog-error"
              role="alert"
              className="flex items-start gap-2 rounded-md border border-destructive-border bg-destructive-soft p-3 text-[13px] text-foreground"
            >
              <AlertTriangle className="mt-0.5 size-4 shrink-0 text-destructive" aria-hidden="true" />
              <span className="break-words">{error}</span>
            </div>
          )}
        </AlertDialogBody>
      )}
      <AlertDialogFooter>
        <AlertDialogCancel disabled={pending}>{cancelLabel}</AlertDialogCancel>
        <Button
          type="submit"
          variant={confirmVariant[tone]}
          disabled={!matches}
          loading={pending}
          className={cn(!matches && 'opacity-50')}
        >
          {confirmLabel}
        </Button>
      </AlertDialogFooter>
    </form>
  )
}
