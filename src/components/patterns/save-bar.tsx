import * as React from 'react'
import { TriangleAlert } from 'lucide-react'

import { cn } from '../../lib/utils'
import { Button } from '../primitives/button'
import { Hint } from '../primitives/tooltip'

/** An additional save flavour shown after Save in a {@link SaveBar} (e.g. "Save & publish", "Save & notify"). */
export interface SaveBarAction {
  /** Button text; name the whole outcome ("Save & publish"). */
  label: React.ReactNode
  /** Runs the save plus the extra step. */
  onClick: () => void
  /** Leading icon. */
  icon?: React.ReactNode
  /** Tooltip spelling out the extra step ("Saves, then emails the 12 subscribers"). */
  hint?: React.ReactNode
  /** This action's save is in flight: spinner on it, every other button disabled. */
  loading?: boolean
}

/** Props of {@link SaveBar}. */
export interface SaveBarProps extends Omit<React.ComponentProps<'div'>, 'children' | 'onReset'> {
  /** The edited data differs from its saved state: enables Save / Cancel and shows the unsaved status. */
  dirty: boolean
  /**
   * The edits have validation errors (live validation): Save stays disabled and `invalidMessage`
   * joins the unsaved status. `FormActions` differs on purpose: there `invalid` reports a failed
   * submit and Save stays enabled.
   */
  invalid?: boolean
  /** A save is in flight: spinner on Save, every other button disabled. */
  saving?: boolean
  /** Last save error (use `getErrorMessage(err)`). Replaces the status on the left, announced as an alert. */
  error?: React.ReactNode
  /** Neutral summary shown on the left while there is nothing to save ("12 headers", "All changes saved"). */
  hint?: React.ReactNode
  /** Shows a Cancel button that discards the edits. Omit it to hide Cancel. */
  onReset?: () => void
  /**
   * Called by the Save button. When omitted, Save is a `type="submit"` button and the enclosing form's
   * `onSubmit` runs (so Enter in a field saves too). Do not pass both `onSave` and handle `onSubmit`.
   */
  onSave?: () => void
  /** Save button text. Default "Save changes". */
  saveLabel?: React.ReactNode
  /** Cancel button text. Default "Cancel". */
  cancelLabel?: React.ReactNode
  /** Status shown on the left while `dirty`, after an amber dot. Default "Unsaved changes". */
  unsavedLabel?: React.ReactNode
  /** Appended to the unsaved status when `invalid`. Default "fix the highlighted fields". */
  invalidMessage?: React.ReactNode
  /**
   * An extra save flavour rendered last as the primary button; Save is then demoted to the default
   * style. Use it when saving can also trigger a follow-up step the user should choose explicitly.
   */
  extraAction?: SaveBarAction
  /**
   * `bar` (default) draws its own top border, tinted strip and padding: put it at the bottom of a card,
   * panel or page section. `inline` renders only the row, for a container that already provides that
   * chrome (e.g. a form card's footer slot).
   */
  variant?: 'bar' | 'inline'
  /**
   * Stick to the bottom of the nearest scrolling ancestor so the actions stay reachable in long forms.
   * Use it with the `bar` variant, whose opaque strip hides the content scrolling underneath; with
   * `inline`, make the container itself sticky instead.
   */
  sticky?: boolean
}

/**
 * Save footer for an editable form or editor: status on the left (unsaved changes, validation hint,
 * last save error, or a neutral summary), then Cancel, Save and an optional extra save action on the
 * right. Save stays disabled until the data is `dirty` and not `invalid`; while a save runs, the other
 * buttons are disabled.
 *
 * Use it for "unsaved changes" footers of editors and long forms (optionally `sticky`). For a plain
 * form card footer without error display or extra action, `FormActions` is enough. Do NOT use it for
 * instant toggles (save on change) or for destructive confirmations (use a confirm dialog).
 */
export function SaveBar({
  dirty,
  invalid = false,
  saving = false,
  error,
  hint,
  onReset,
  onSave,
  saveLabel = 'Save changes',
  cancelLabel = 'Cancel',
  unsavedLabel = 'Unsaved changes',
  invalidMessage = 'fix the highlighted fields',
  extraAction,
  variant = 'bar',
  sticky = false,
  className,
  ...props
}: SaveBarProps) {
  const extraLoading = extraAction?.loading ?? false
  const busy = saving || extraLoading
  const hasError = error != null && error !== false && error !== ''

  const extraButton = extraAction && (
    <Button
      type="button"
      variant="primary"
      icon={extraAction.icon}
      disabled={!dirty || invalid || saving}
      loading={extraLoading}
      onClick={extraAction.onClick}
    >
      {extraAction.label}
    </Button>
  )

  return (
    <div
      data-slot="save-bar"
      data-dirty={dirty || undefined}
      className={cn(
        'flex w-full flex-wrap items-center justify-end gap-2',
        variant === 'bar' && 'border-t bg-surface-75 px-5 py-3 md:px-6 dark:bg-transparent',
        sticky && 'sticky bottom-0 z-10 dark:bg-surface-75',
        className,
      )}
      {...props}
    >
      <div data-slot="save-bar-status" className="mr-auto flex min-w-0 items-center gap-2 text-[13px] text-foreground-light">
        {hasError ? (
          <p role="alert" className="flex min-w-0 items-start gap-1.5 text-destructive">
            <TriangleAlert className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
            <span className="break-words">{error}</span>
          </p>
        ) : dirty ? (
          <>
            <span aria-hidden="true" className="size-1.5 shrink-0 rounded-full bg-warning" />
            <span>
              {unsavedLabel}
              {invalid && <span className="text-destructive"> · {invalidMessage}</span>}
            </span>
          </>
        ) : (
          hint && <span>{hint}</span>
        )}
      </div>
      {onReset && (
        <Button type="button" disabled={!dirty || busy} onClick={onReset}>
          {cancelLabel}
        </Button>
      )}
      <Button
        type={onSave ? 'button' : 'submit'}
        variant={extraAction ? 'default' : 'primary'}
        disabled={!dirty || invalid || extraLoading}
        loading={saving}
        onClick={onSave}
      >
        {saveLabel}
      </Button>
      {extraButton && (extraAction?.hint ? <Hint label={extraAction.hint}>{extraButton}</Hint> : extraButton)}
    </div>
  )
}
