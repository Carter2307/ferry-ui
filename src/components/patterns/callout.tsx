import * as React from 'react'
import { CircleCheck, Info, RefreshCw, TriangleAlert } from 'lucide-react'

import { Button } from '../primitives/button'
import { getErrorMessage } from '../../lib/errors'
import { cn } from '../../lib/utils'

/* -------------------------------------------------------------------------------------------------
 * Callout
 * -----------------------------------------------------------------------------------------------*/

/**
 * Colour of a {@link Callout} (same vocabulary as the status tones):
 * - `info` — neutral guidance, a feature that is off, work in progress.
 * - `warning` — something needs attention but nothing is broken yet.
 * - `destructive` — something failed or will fail (announced as an alert).
 * - `success` — a positive outcome worth keeping on screen (not a transient toast).
 * - `neutral` — a plain side note (no default icon).
 */
export type CalloutTone = 'info' | 'warning' | 'destructive' | 'success' | 'neutral'

/**
 * Density of a boxed {@link Callout}:
 * - `md` — 14px padding, 8px radius, 14px title and lighter body text. Page sections and cards.
 * - `sm` — 12px padding, 6px radius, body in the main foreground (lighter when there is a title).
 *   Form-submit errors and notices inside dialogs, popovers and dense panels.
 */
export type CalloutSize = 'md' | 'sm'

/**
 * Frame of a {@link Callout}:
 * - `box` — bordered, rounded, tinted box that sits in the flow of the content.
 * - `banner` — full-width tinted strip with a bottom border only, text in the tone colour. Put it flush
 *   at the top of a card or panel, never floating between paragraphs.
 */
export type CalloutVariant = 'box' | 'banner'

/**
 * Where the {@link Callout} `actions` go:
 * - `bottom` — under the text, left-aligned. Several actions or a long label.
 * - `end` — on the right of the text from the `sm` breakpoint (stacked under it on phones, the icon
 *   staying beside the text). One short action that resolves the message: Retry, Reload, Show the row.
 */
export type CalloutActionsPlacement = 'bottom' | 'end'

const toneClass: Record<CalloutTone, string> = {
  info: 'border-info-border bg-info-soft [&_[data-icon]]:text-info',
  warning: 'border-warning-border bg-warning-soft [&_[data-icon]]:text-warning',
  destructive: 'border-destructive-border bg-destructive-soft [&_[data-icon]]:text-destructive',
  success: 'border-success/30 bg-success-soft [&_[data-icon]]:text-success',
  neutral: 'border-border-strong bg-surface-200 [&_[data-icon]]:text-foreground-lighter',
}

/** Text colour of the `banner` variant, whose message is written in the tone colour. */
const bannerTextClass: Record<CalloutTone, string> = {
  info: 'text-info',
  warning: 'text-warning',
  destructive: 'text-destructive',
  success: 'text-success',
  neutral: 'text-foreground-light',
}

const defaultIcon: Record<CalloutTone, React.ReactNode> = {
  info: <Info />,
  warning: <TriangleAlert />,
  destructive: <TriangleAlert />,
  success: <CircleCheck />,
  neutral: null,
}

/** True when a slot holds something React would render. */
function hasContent(node: React.ReactNode) {
  return node !== undefined && node !== null && node !== false && node !== true && node !== ''
}

/** Props of {@link Callout}. Extra `<div>` props (`id`, `aria-*`, `data-*`) go to the root. */
export interface CalloutProps extends Omit<React.ComponentProps<'div'>, 'title'> {
  /** Colour, default icon and default ARIA role. Defaults to `info`. See {@link CalloutTone}. */
  tone?: CalloutTone
  /** `md` (default) for page sections and cards, `sm` for compact errors in forms and dialogs. Ignored by `variant="banner"`. See {@link CalloutSize}. */
  size?: CalloutSize
  /** `box` (default) in the content flow, `banner` flush at the top of a card or panel. See {@link CalloutVariant}. */
  variant?: CalloutVariant
  /**
   * 16px icon on the left, tinted with the tone colour. Omitted (or `true`), it is the tone's icon
   * (info: Info, warning / destructive: TriangleAlert, success: CircleCheck, neutral: none). Pass another
   * Lucide icon to replace it, or `false` (or `null`) to hide it, e.g. when the callout wraps a checkbox.
   */
  icon?: React.ReactNode
  /** Bold first line. Optional: a callout can be a single sentence of body text. */
  title?: React.ReactNode
  /**
   * The message. Can hold paragraphs, lists, inline code or form controls; long unbroken tokens (ids,
   * URLs) wrap. It is drawn in the lighter foreground (`md`, or `sm` with a title), the main foreground
   * (`sm` without a title) or the tone colour (`banner`).
   */
  children?: React.ReactNode
  /** Small buttons (`size="tiny"`), e.g. "Retry", "Discard my edits", "Learn more". Placed by `actionsPlacement`. */
  actions?: React.ReactNode
  /** `bottom` (default) under the text, or `end` on the right of it. See {@link CalloutActionsPlacement}. */
  actionsPlacement?: CalloutActionsPlacement
  /**
   * ARIA role of the root. Defaults to `alert` for `destructive` (read out as soon as it appears) and
   * `note` for the other tones. Override it, e.g. with `status` for a polite live update.
   */
  role?: React.AriaRole
}

/**
 * Inline, tinted message (info, warning, destructive, success or neutral) with a tone icon, an optional
 * title and actions. Comes as a box (`md` or compact `sm`) or as a flush `banner` strip.
 *
 * Use it for persistent, contextual messages tied to a page, a card or a form: a feature that is off, a
 * conflicting edit, why a submit failed (`size="sm"` under the fields of a dialog), a warning holding a
 * confirmation checkbox, a lost connection at the top of a panel (`variant="banner"`). Do NOT use it for
 * transient feedback after an action (use the `Toaster`), to ask for a blocking confirmation (use
 * `ConfirmDialog`), for an empty collection (use `EmptyState`), for a first load that failed with nothing
 * to show (use `ErrorState`), nor for the error of a single field (show it under the field).
 */
export function Callout({
  tone = 'info',
  size = 'md',
  variant = 'box',
  icon,
  title,
  children,
  actions,
  actionsPlacement = 'bottom',
  role,
  className,
  ...props
}: CalloutProps) {
  const banner = variant === 'banner'
  const compact = !banner && size === 'sm'
  const withTitle = hasContent(title)
  const withActions = hasContent(actions)
  const actionsAtEnd = withActions && actionsPlacement === 'end'
  const iconNode = icon === undefined || icon === true ? defaultIcon[tone] : icon

  const content = (
    <div data-slot="callout-content" className={cn('flex min-w-0 flex-1 flex-col', banner || compact ? 'gap-0.5' : 'gap-1')}>
      {withTitle && (
        <p
          data-slot="callout-title"
          className={cn('font-medium', !banner && 'text-foreground', !banner && !compact && 'text-sm')}
        >
          {title}
        </p>
      )}
      {hasContent(children) && (
        <div
          data-slot="callout-description"
          className={cn('break-words', !banner && (!compact || withTitle) && 'text-foreground-light')}
        >
          {children}
        </div>
      )}
      {withActions && !actionsAtEnd && (
        <div data-slot="callout-actions" className="mt-2 flex flex-wrap gap-2">
          {actions}
        </div>
      )}
    </div>
  )

  return (
    <div
      data-slot="callout"
      data-tone={tone}
      data-size={banner ? undefined : size}
      data-variant={variant}
      role={role || (tone === 'destructive' ? 'alert' : 'note')}
      className={cn(
        'flex text-[13px]',
        toneClass[tone],
        banner && ['gap-2 border-b px-3 py-2', bannerTextClass[tone]],
        compact && 'gap-2 rounded-md border p-3 text-foreground',
        !banner && !compact && 'gap-3 rounded-lg border p-3.5',
        (banner || compact || actionsAtEnd) && 'items-start',
        actionsAtEnd && !withTitle && 'sm:items-center',
        className,
      )}
      {...props}
    >
      {hasContent(iconNode) && (
        <span
          data-icon
          data-slot="callout-icon"
          aria-hidden="true"
          className={cn('mt-0.5 shrink-0 [&_svg]:size-4', actionsAtEnd && !withTitle && 'sm:mt-0')}
        >
          {iconNode}
        </span>
      )}
      {actionsAtEnd ? (
        // Text and action share the space beside the icon: side by side from `sm`, stacked below it.
        <div
          data-slot="callout-body"
          className={cn(
            'flex min-w-0 flex-1 flex-col gap-2 sm:flex-row',
            !banner && !compact && 'sm:gap-3',
            withTitle ? 'sm:items-start' : 'sm:items-center',
          )}
        >
          {content}
          <div data-slot="callout-actions" className="flex shrink-0 items-center gap-2">
            {actions}
          </div>
        </div>
      ) : (
        content
      )}
    </div>
  )
}

/* -------------------------------------------------------------------------------------------------
 * StaleDataCallout
 * -----------------------------------------------------------------------------------------------*/

/** Props of {@link StaleDataCallout}. Extra props (`title`, `size`, `variant`, `actionsPlacement`, `<div>` props) go to the underlying {@link Callout}. */
export interface StaleDataCalloutProps extends Omit<CalloutProps, 'tone' | 'icon' | 'actions' | 'children'> {
  /** What the failed refresh threw or rejected with; its message is appended to the sentence through `getErrorMessage`. */
  error: unknown
  /** Called by the Retry button. */
  onRetry: () => void
  /** Spinner on the Retry button (disabled) while the new attempt runs. */
  retrying?: boolean
  /** Label of the Retry button. Defaults to "Retry". */
  retryLabel?: React.ReactNode
  /** Replaces the default sentence (`This data may be out of date. Refreshing failed: <message>`). */
  children?: React.ReactNode
}

/**
 * Warning callout for a background refresh that failed while earlier data is still on screen: keeps the
 * stale data visible, says so, shows the error's message and offers Retry.
 *
 * Place it above the (stale) content. Do NOT use it when nothing was loaded yet (use `ErrorState` in
 * place of the content) nor for failed user actions (use a toast or an inline error).
 */
export function StaleDataCallout({
  error,
  onRetry,
  retrying,
  retryLabel = 'Retry',
  children,
  ...props
}: StaleDataCalloutProps) {
  return (
    <Callout
      data-slot="stale-data-callout"
      tone="warning"
      actions={
        <Button size="tiny" icon={<RefreshCw />} loading={retrying} onClick={onRetry}>
          {retryLabel}
        </Button>
      }
      {...props}
    >
      {children ?? <>This data may be out of date. Refreshing failed: {getErrorMessage(error)}</>}
    </Callout>
  )
}
