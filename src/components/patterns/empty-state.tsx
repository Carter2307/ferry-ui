import * as React from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'

import { Button } from '../primitives/button'
import { getErrorMessage } from '../../lib/errors'
import { cn } from '../../lib/utils'

/* -------------------------------------------------------------------------------------------------
 * EmptyState
 * -----------------------------------------------------------------------------------------------*/

/** Props of {@link EmptyState}. Extra `<div>` props (`id`, `aria-*`, `data-*`) go to the root. */
export interface EmptyStateProps extends Omit<React.ComponentProps<'div'>, 'title'> {
  /** Lucide icon (or any 18px glyph) above the title, drawn in the lighter foreground. Tint it with a class (`text-destructive`) for error-like states. */
  icon?: React.ReactNode
  /** One short sentence saying what is missing ("No invoices yet", "No results for “acme”"). */
  title: React.ReactNode
  /** What the area is for and how to fill it, in one or two sentences. */
  description?: React.ReactNode
  /** Call-to-action buttons, centered under the text. Usually one `primary` button (create / import) or a "Clear filters" button. */
  actions?: React.ReactNode
  /**
   * Frame of the block:
   * - `dashed` (default) — dashed border; "there is room for content here" (empty lists, drop zones).
   * - `bordered` — solid card with a shadow; standalone pages (not found, crashed, no access).
   * - `plain` — no frame; inside an existing card, panel or popover.
   */
  variant?: 'dashed' | 'bordered' | 'plain'
  /** Vertical padding: `sm` 24px (cards, side panels), `md` 40px (default, sections), `lg` 64px (whole page / first-run). */
  size?: 'sm' | 'md' | 'lg'
  /** Extra content under the actions: a code snippet, a help link, a small illustration. */
  children?: React.ReactNode
}

/**
 * Centered placeholder for an area with nothing to show: icon, title, description and call-to-action
 * buttons, in a dashed box by default.
 *
 * Use it for empty lists and first-run screens (explain what goes here + the button that creates it),
 * filtered lists with no match (offer "Clear filters"), and full-page dead ends (not found, crashed) with
 * `variant="bordered"`. Do NOT use it for load failures that can be retried (use {@link ErrorState}),
 * for loading (use skeletons), nor inside a table body (use `TableMessageRow`).
 */
export function EmptyState({
  icon,
  title,
  description,
  actions,
  variant = 'dashed',
  size = 'md',
  className,
  children,
  ...props
}: EmptyStateProps) {
  return (
    <div
      data-slot="empty-state"
      data-variant={variant}
      className={cn(
        'flex w-full flex-col items-center justify-center gap-3 rounded-lg text-center',
        variant === 'dashed' && 'border border-dashed border-border-stronger',
        variant === 'bordered' && 'border bg-surface-100 shadow-card',
        size === 'sm' && 'px-4 py-6',
        size === 'md' && 'px-6 py-10',
        size === 'lg' && 'px-6 py-16',
        className,
      )}
      {...props}
    >
      {icon && (
        <div
          data-slot="empty-state-icon"
          aria-hidden="true"
          className="flex items-center justify-center text-foreground-lighter [&_svg]:size-[18px]"
        >
          {icon}
        </div>
      )}
      <div className="flex max-w-md flex-col gap-1">
        <p data-slot="empty-state-title" className="text-sm font-medium text-foreground">
          {title}
        </p>
        {description && (
          <div data-slot="empty-state-description" className="text-[13px] text-foreground-light">
            {description}
          </div>
        )}
      </div>
      {actions && (
        <div data-slot="empty-state-actions" className="mt-1 flex flex-wrap items-center justify-center gap-2">
          {actions}
        </div>
      )}
      {children}
    </div>
  )
}

/* -------------------------------------------------------------------------------------------------
 * ErrorState
 * -----------------------------------------------------------------------------------------------*/

/** Props of {@link ErrorState}. Extra `<div>` props go to the root. */
export interface ErrorStateProps extends Omit<React.ComponentProps<'div'>, 'title'> {
  /**
   * What was thrown or rejected (an `Error`, a string, anything). Its message is shown under the title
   * through `getErrorMessage`; a value without a message shows the title alone. Ignored when
   * `description` is set.
   */
  error?: unknown
  /** Headline naming what failed ("Could not load invoices"). Defaults to "Something went wrong". */
  title?: React.ReactNode
  /** Custom message replacing the one read from `error` (e.g. a friendlier text for a known error code). */
  description?: React.ReactNode
  /** Shows a Retry button that calls it. Omit it when retrying cannot help (e.g. a permission error). */
  onRetry?: () => void
  /** Spinner on the Retry button while the new attempt runs. */
  retrying?: boolean
  /** Label of the Retry button. Defaults to "Retry". */
  retryLabel?: React.ReactNode
}

/**
 * Red error box for content that failed to load: warning icon, title, the error's message and an
 * optional Retry button. Announced with `role="alert"`.
 *
 * Use it in place of a list, a panel or a page body when the first load failed and there is nothing to
 * show. Do NOT use it when data from an earlier load is still on screen (keep the data and show
 * `StaleDataCallout`), inside a table body (use `TableErrorRow`), nor for form validation (show the
 * message next to the field).
 */
export function ErrorState({
  error,
  title = 'Something went wrong',
  description,
  onRetry,
  retrying,
  retryLabel = 'Retry',
  className,
  ...props
}: ErrorStateProps) {
  // No fallback text: when the thrown value carries no message, the title alone says it.
  const message = description ?? (error !== undefined ? getErrorMessage(error, '') : null)
  return (
    <div
      data-slot="error-state"
      role="alert"
      className={cn(
        'flex flex-col items-start gap-3 rounded-lg border border-destructive-border bg-destructive-soft p-4 sm:flex-row sm:items-center',
        className,
      )}
      {...props}
    >
      <AlertTriangle className="size-4 shrink-0 text-destructive" aria-hidden="true" />
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <p data-slot="error-state-title" className="text-sm font-medium text-foreground">
          {title}
        </p>
        {message && (
          <div data-slot="error-state-description" className="text-[13px] break-words text-foreground-light">
            {message}
          </div>
        )}
      </div>
      {onRetry && (
        <Button size="tiny" icon={<RefreshCw />} onClick={onRetry} loading={retrying}>
          {retryLabel}
        </Button>
      )}
    </div>
  )
}
