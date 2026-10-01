import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { AlertTriangle, Check, CircleDashed, Info, Loader2, X } from 'lucide-react'

import { cn } from '../../lib/utils'

/* -------------------------------------------------------------------------------------------------
 * StatusTone
 * -----------------------------------------------------------------------------------------------*/

/**
 * Semantic colour of a status indicator, shared by {@link StatusDot}, {@link StatusBadge} and
 * {@link StatusLine}:
 * - `success` — healthy, done, active, paid.
 * - `warning` — degraded, needs attention soon, expiring.
 * - `destructive` — failed, errored, overdue, blocked.
 * - `info` — in progress, syncing, pending review (pair with `pulse` / `spin`).
 * - `neutral` — inactive, paused, draft, canceled, unknown.
 *
 * Map your own domain statuses to a tone once, next to your types, and pass the result down:
 *
 * ```ts
 * const ORDER_STATUS: Record<OrderStatus, { tone: StatusTone; pulse?: boolean; label: string }> = {
 *   pending: { tone: 'neutral', pulse: true, label: 'Pending' },
 *   shipped: { tone: 'info', label: 'Shipped' },
 *   delivered: { tone: 'success', label: 'Delivered' },
 *   refunded: { tone: 'warning', label: 'Refunded' },
 *   failed: { tone: 'destructive', label: 'Payment failed' },
 * }
 * ```
 */
export type StatusTone = 'success' | 'warning' | 'destructive' | 'info' | 'neutral'

/** Every {@link StatusTone}, in display order (handy for pickers, legends and docs). */
export const STATUS_TONES: readonly StatusTone[] = ['success', 'warning', 'destructive', 'info', 'neutral']

const dotTone: Record<StatusTone, string> = {
  success: 'bg-success',
  warning: 'bg-warning',
  destructive: 'bg-destructive-solid',
  info: 'bg-info',
  neutral: 'bg-foreground-muted',
}

/* -------------------------------------------------------------------------------------------------
 * StatusDot
 * -----------------------------------------------------------------------------------------------*/

/** Props of {@link StatusDot}. */
export interface StatusDotProps extends Omit<React.ComponentProps<'span'>, 'children'> {
  /** Colour of the dot. Defaults to `neutral`. */
  tone?: StatusTone
  /** Adds a soft ping ring around the dot. Use it only for live or in-progress states (running, syncing, recording). */
  pulse?: boolean
  /**
   * Accessible name ("Online", "Syncing"). Without it the dot is decorative (`aria-hidden`), which is
   * right when a text label sits next to it. Set it when the dot is the only status cue (e.g. a
   * dot-only table column).
   */
  label?: string
}

/**
 * 6px round status dot, optionally pulsing. The smallest status cue: put it before a name in a
 * list, a menu item, a command-palette row or a "Live" indicator.
 *
 * Use it next to text that already names the state. Do NOT use it alone for important states
 * without a `label` (colour is not enough); use {@link StatusBadge} when the state itself must be read.
 */
export function StatusDot({ tone = 'neutral', pulse = false, label, className, ...props }: StatusDotProps) {
  return (
    <span
      data-slot="status-dot"
      data-tone={tone}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      className={cn('relative inline-flex size-1.5 shrink-0', className)}
      {...props}
    >
      {pulse && (
        <span
          className={cn('absolute inset-0 animate-ping rounded-full opacity-60 motion-reduce:animate-none', dotTone[tone])}
        />
      )}
      <span className={cn('relative inline-flex size-full rounded-full', dotTone[tone])} />
    </span>
  )
}

/* -------------------------------------------------------------------------------------------------
 * StatusBadge
 * -----------------------------------------------------------------------------------------------*/

/**
 * Class generator behind {@link StatusBadge}. Use it to give another element (a button that opens
 * a tooltip, a link) the exact status-badge look.
 *
 * Variants:
 * - `tone` — a {@link StatusTone}: soft tinted fill + tinted border + tinted text (`neutral` is grey).
 * - `size` — `md` (20px, default) or `sm` (18px) for tight headers and inline next to titles.
 */
export const statusBadgeVariants = cva(
  [
    'inline-flex w-fit shrink-0 items-center gap-1.5 rounded-full border leading-none font-medium tracking-[0.04em] whitespace-nowrap uppercase',
    '[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*=size-])]:size-3',
  ],
  {
    variants: {
      tone: {
        success: 'border-success/30 bg-success-soft text-success',
        warning: 'border-warning-border bg-warning-soft text-warning',
        destructive: 'border-destructive-border bg-destructive-soft text-destructive',
        info: 'border-info-border bg-info-soft text-info',
        neutral: 'border-border-strong bg-surface-200 text-foreground-light',
      },
      size: {
        md: 'h-5 px-2 text-[10.5px]',
        sm: 'h-[18px] px-1.5 text-[10px]',
      },
    },
    defaultVariants: { tone: 'neutral', size: 'md' },
  },
)

/** Props of {@link StatusBadge}. */
export interface StatusBadgeProps
  extends Omit<React.ComponentProps<'span'>, 'children'>,
    VariantProps<typeof statusBadgeVariants> {
  /** Colour of the badge (and of its dot). Defaults to `neutral`. */
  tone?: StatusTone
  /**
   * Height and padding: `md` (20px, default) everywhere; `sm` (18px, 10px text) inline next to a
   * page or card title where a 20px pill looks heavy.
   */
  size?: 'md' | 'sm'
  /** The state, 1–3 words ("Active", "Past due", "Syncing"). Rendered uppercase; it never wraps. */
  label: React.ReactNode
  /**
   * Pulses the leading dot for live or in-progress states ("Running", "Processing"). No effect when
   * the dot is hidden (`dot={false}`, or an `icon` without `dot`).
   */
  pulse?: boolean
  /** Leading icon (lucide, sized to 12px). When set, the dot is hidden unless `dot` is forced to `true`. */
  icon?: React.ReactNode
  /** Shows the leading status dot. Defaults to `true`, or `false` when an `icon` is given. */
  dot?: boolean
}

/**
 * Uppercase status pill with a leading dot: `● ACTIVE`, `● PAST DUE`, `◌ SYNCING` (pulsing).
 * The standard way to show the state of a record in tables, headers, info tiles and cards.
 *
 * Pick the `tone` from a map of your domain statuses (see {@link StatusTone}); set `pulse` only
 * while something is actually happening. Use `size="sm"` next to page titles. Do NOT use it for
 * static tags, categories or counts (use `Badge`), nor for long sentences (it never wraps).
 */
export function StatusBadge({
  tone = 'neutral',
  size,
  label,
  pulse = false,
  icon,
  dot,
  className,
  ...props
}: StatusBadgeProps) {
  const showDot = dot ?? !icon
  return (
    <span
      data-slot="status-badge"
      data-tone={tone}
      className={cn(statusBadgeVariants({ tone, size }), className)}
      {...props}
    >
      {showDot && <StatusDot tone={tone} pulse={pulse} />}
      {icon}
      {label}
    </span>
  )
}

/* -------------------------------------------------------------------------------------------------
 * StatusLine
 * -----------------------------------------------------------------------------------------------*/

const lineTone: Record<StatusTone, string> = {
  success: 'border-success/40 text-success',
  warning: 'border-warning-border text-warning',
  destructive: 'border-destructive-border text-destructive',
  info: 'border-info-border text-info',
  neutral: 'border-border-stronger text-foreground-lighter',
}

const lineIcon: Record<StatusTone, React.ComponentType> = {
  success: Check,
  warning: AlertTriangle,
  destructive: X,
  info: Info,
  neutral: CircleDashed,
}

/** Props of {@link StatusLine}. */
export interface StatusLineProps extends React.ComponentProps<'span'> {
  /** Colour of the circled icon. Defaults to `neutral`. */
  tone?: StatusTone
  /**
   * Icon inside the 20px circle (sized to 12px). Defaults to a per-tone icon: check (success),
   * triangle (warning), cross (destructive), info (info), dashed circle (neutral) — or a spinner
   * when `spin` is set.
   */
  icon?: React.ReactNode
  /** Spins the icon for in-progress states ("Syncing…", "Importing…"). Without `icon`, shows a spinner. */
  spin?: boolean
  /** Extra classes for the circle, e.g. a custom ring colour (`border-primary/40 text-primary`). */
  iconClassName?: string
  /** The sentence describing the state ("Workspace is active", "Payment failed"). Truncates on one line. */
  children: React.ReactNode
}

/**
 * Sentence-case status row: a small outlined circle with an icon, then a label — `(✓) Workspace is
 * active`, `(⟳) Syncing…`. Made for card footers ({@link ResourceCard}) and summary panels where a
 * full sentence reads better than a pill.
 *
 * Do NOT use it in dense tables or headers (use {@link StatusBadge}), nor for alerts that need an
 * action (use a callout/alert).
 */
export function StatusLine({
  tone = 'neutral',
  icon,
  spin = false,
  iconClassName,
  children,
  className,
  ...props
}: StatusLineProps) {
  const DefaultIcon = spin ? Loader2 : lineIcon[tone]
  return (
    <span
      data-slot="status-line"
      data-tone={tone}
      className={cn('inline-flex min-w-0 items-center gap-2 text-[13px] text-foreground-light', className)}
      {...props}
    >
      <span
        aria-hidden="true"
        className={cn(
          'flex size-5 shrink-0 items-center justify-center rounded-full border bg-surface-100 [&_svg]:size-3 [&_svg]:stroke-[2.5]',
          spin && '[&_svg]:animate-spin motion-reduce:[&_svg]:animate-none',
          lineTone[tone],
          iconClassName,
        )}
      >
        {icon ?? <DefaultIcon />}
      </span>
      <span className="truncate">{children}</span>
    </span>
  )
}
