import * as React from 'react'
import { ArrowDownRight, ArrowRight, ArrowUpRight, Info } from 'lucide-react'

import { Skeleton } from '../primitives/skeleton'
import { Hint } from '../primitives/tooltip'
import { cn } from '../../lib/utils'

import { MonoLabel } from './mono-label'

/** True for nodes that render something (0 counts; null, undefined, false and '' do not). */
function hasContent(node: React.ReactNode): boolean {
  return node !== undefined && node !== null && node !== false && node !== ''
}

/* -------------------------------------------------------------------------------------------------
 * MetricCard
 * -----------------------------------------------------------------------------------------------*/

/** Props of {@link MetricCard}. */
export interface MetricCardProps extends Omit<React.ComponentProps<'div'>, 'children'> {
  /** Short caption rendered as a {@link MonoLabel} ("Revenue", "Active users", "Error rate"). */
  label: React.ReactNode
  /**
   * The number, already formatted ("12.4%", "$48,200", "1,284"; `0` is shown). Omit to render a card
   * with only a label and `children`.
   */
  value?: React.ReactNode
  /** Small muted text right after the value ("of 10", "/ 50 GB", "per month"). */
  unit?: React.ReactNode
  /** Change indicator after the value, usually a {@link MetricTrend} ("↗ +12.5%"). Shown only with a `value`. */
  trend?: React.ReactNode
  /** Secondary line under the value ("Last 30 days", "Updated 2 min ago"). Truncated to one line. */
  hint?: React.ReactNode
  /**
   * Explanation shown in a tooltip from an (i) button next to the label (hover or keyboard focus).
   * Keep it to one sentence; requires a `TooltipProvider` ancestor. Not reachable on touch screens,
   * so never put essential information here.
   */
  info?: React.ReactNode
  /** Accessible name of the (i) info button. Defaults to "More info"; make it specific in dense grids. */
  infoLabel?: string
  /** Right side of the header (12px muted text): a legend ({@link LegendDot}), a status badge or a small link. */
  aside?: React.ReactNode
  /**
   * Shows a skeleton instead of the value, hides `unit`, `trend` and `hint`, and sets `aria-busy`.
   * `children` still render, so give them their own empty or loading state.
   */
  loading?: boolean
  /** Extra content under the value: a {@link UsageBar}, a sparkline, a chart or a breakdown. */
  children?: React.ReactNode
  /** Tighter padding (16px instead of 20px) for dense grids of many small cards. */
  compact?: boolean
}

/**
 * Bordered KPI card: mono label (+ info tooltip, + header aside) over a big tabular number
 * (+ unit, trend, hint), with optional content (bar, chart) underneath.
 *
 * Use it for dashboard numbers people scan and compare: usage, revenue, counts, rates. Lay several
 * out in a grid (`grid gap-4 sm:grid-cols-2 lg:grid-cols-4`). Do NOT use it for non-numeric facts
 * like an owner or a plan name (use `InfoTile`), nor as a generic content container (use `Card`).
 */
export function MetricCard({
  label,
  value,
  unit,
  trend,
  hint,
  info,
  infoLabel = 'More info',
  aside,
  loading = false,
  children,
  compact = false,
  className,
  ...props
}: MetricCardProps) {
  return (
    <div
      data-slot="metric-card"
      aria-busy={loading || undefined}
      className={cn(
        'flex min-w-0 flex-col gap-3 rounded-lg border bg-surface-100 shadow-card',
        compact ? 'p-4' : 'p-5',
        className,
      )}
      {...props}
    >
      <div data-slot="metric-card-header" className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-1.5">
          <MonoLabel>{label}</MonoLabel>
          {hasContent(info) && (
            <Hint label={info}>
              <button
                type="button"
                className="rounded-full text-foreground-muted outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
                aria-label={infoLabel}
              >
                <Info aria-hidden="true" className="size-3.5" />
              </button>
            </Hint>
          )}
        </div>
        {hasContent(aside) && (
          <div data-slot="metric-card-aside" className="flex items-center gap-3 text-[12px] text-foreground-lighter">
            {aside}
          </div>
        )}
      </div>
      {loading ? (
        <Skeleton className="h-6 w-20" />
      ) : (
        <>
          {hasContent(value) && (
            <div data-slot="metric-card-value" className="flex flex-wrap items-baseline gap-x-1.5">
              <span className="text-xl text-foreground tabular md:text-[22px]">{value}</span>
              {hasContent(unit) && <span className="text-[13px] text-foreground-lighter">{unit}</span>}
              {hasContent(trend) && <span className="ml-1">{trend}</span>}
            </div>
          )}
          {hasContent(hint) && (
            <div data-slot="metric-card-hint" className="-mt-2 truncate text-[13px] text-foreground-lighter">
              {hint}
            </div>
          )}
        </>
      )}
      {children}
    </div>
  )
}

/* -------------------------------------------------------------------------------------------------
 * MetricTrend
 * -----------------------------------------------------------------------------------------------*/

/** Direction of a {@link MetricTrend}: picks the arrow. */
export type MetricTrendDirection = 'up' | 'down' | 'flat'

/** Whether a change is good, bad or neutral: picks the color. */
export type MetricTrendSentiment = 'positive' | 'negative' | 'neutral'

/** Props of {@link MetricTrend}. */
export interface MetricTrendProps extends React.ComponentProps<'span'> {
  /** Arrow direction. Defaults to `up`. */
  direction?: MetricTrendDirection
  /**
   * Color. Defaults to `positive` (green) for `up`, `negative` (red) for `down`, `neutral` (muted)
   * for `flat`. Override it when a rise is bad (error rate, churn, latency):
   * `direction="up" sentiment="negative"`.
   */
  sentiment?: MetricTrendSentiment
  /** The signed, formatted change ("+12.5%", "-3 pts"). It must make sense without the arrow. */
  children?: React.ReactNode
}

const TREND_ICON: Record<MetricTrendDirection, typeof ArrowUpRight> = {
  up: ArrowUpRight,
  down: ArrowDownRight,
  flat: ArrowRight,
}

const TREND_DEFAULT_SENTIMENT: Record<MetricTrendDirection, MetricTrendSentiment> = {
  up: 'positive',
  down: 'negative',
  flat: 'neutral',
}

const TREND_COLOR: Record<MetricTrendSentiment, string> = {
  positive: 'text-success',
  negative: 'text-destructive',
  neutral: 'text-foreground-lighter',
}

/**
 * Small colored change indicator with an arrow ("↗ +12.5%"). Pass it to `MetricCard`'s `trend`,
 * or use it inline next to any number.
 *
 * Put the signed, formatted delta in `children`; the arrow is decorative and color is not enough on
 * its own, so the text must carry the meaning. Do NOT use it for absolute values or statuses (use a
 * `Badge` or a status badge).
 */
export function MetricTrend({ direction = 'up', sentiment, className, children, ...props }: MetricTrendProps) {
  const Icon = TREND_ICON[direction]
  const tone = sentiment ?? TREND_DEFAULT_SENTIMENT[direction]
  return (
    <span
      data-slot="metric-trend"
      data-direction={direction}
      data-sentiment={tone}
      className={cn('inline-flex items-baseline gap-0.5 text-[12.5px] leading-none tabular', TREND_COLOR[tone], className)}
      {...props}
    >
      {/* The icon stays out of baseline alignment so the text sits on the value's baseline. */}
      <Icon aria-hidden="true" className="size-3.5 shrink-0 self-center" />
      {children}
    </span>
  )
}

/* -------------------------------------------------------------------------------------------------
 * UsageBar
 * -----------------------------------------------------------------------------------------------*/

/** Every {@link UsageBarTone}, in order (handy for controls and tests). */
export const USAGE_BAR_TONES = ['auto', 'brand', 'warning', 'destructive'] as const

/**
 * Color of a {@link UsageBar}. `auto` switches from `brand` to `warning` to `destructive` as the
 * value crosses `warningAt` / `destructiveAt`; the others force one color whatever the value.
 */
export type UsageBarTone = (typeof USAGE_BAR_TONES)[number]

/** Props of {@link UsageBar}. */
export interface UsageBarProps extends Omit<React.ComponentProps<'div'>, 'children'> {
  /** Percentage, 0–100 (clamped). `null`/`undefined`/`NaN` render an empty bar. */
  value: number | null | undefined
  /** Fill color. Defaults to `auto` (threshold based). Force a tone only when thresholds do not apply. */
  tone?: UsageBarTone
  /**
   * Accessible name of the meter ("Storage used"). Always set it, or pass `aria-labelledby`. Add
   * `aria-valuetext` ("46 of 50 GB") when the raw percentage is not what people read.
   */
  label?: string
  /** Percentage at which the `auto` tone turns `warning`. Defaults to 75. */
  warningAt?: number
  /** Percentage at which the `auto` tone turns `destructive`. Defaults to 90. */
  destructiveAt?: number
}

const USAGE_FILL: Record<Exclude<UsageBarTone, 'auto'>, string> = {
  brand: 'bg-brand',
  warning: 'bg-warning',
  destructive: 'bg-destructive-solid',
}

/**
 * Thin (6px) horizontal meter for a 0–100 percentage: quota used, seats taken, storage, progress
 * toward a limit. Exposed as `role="meter"`; `data-tone` holds the resolved color.
 *
 * Use it inside a `MetricCard` (as `children`) or next to a label in a list. Do NOT use it for
 * indeterminate progress or task completion over time (use a spinner or a progress indicator).
 */
export function UsageBar({
  value,
  tone = 'auto',
  label,
  warningAt = 75,
  destructiveAt = 90,
  className,
  ...props
}: UsageBarProps) {
  const pct = value === null || value === undefined || !Number.isFinite(value) ? 0 : Math.max(0, Math.min(100, value))
  const resolved: Exclude<UsageBarTone, 'auto'> =
    tone === 'auto' ? (pct >= destructiveAt ? 'destructive' : pct >= warningAt ? 'warning' : 'brand') : tone
  return (
    <div
      data-slot="usage-bar"
      data-tone={resolved}
      role="meter"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(pct)}
      className={cn('h-1.5 w-full overflow-hidden rounded-full bg-foreground/[0.07]', className)}
      {...props}
    >
      <div
        className={cn(
          'h-full rounded-full transition-[width] duration-500 motion-reduce:transition-none',
          USAGE_FILL[resolved],
        )}
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}

/* -------------------------------------------------------------------------------------------------
 * LegendDot
 * -----------------------------------------------------------------------------------------------*/

/** Every {@link LegendDotTone}, in order (handy for controls and tests). */
export const LEGEND_DOT_TONES = [
  'brand',
  'chart-1',
  'chart-2',
  'chart-3',
  'chart-4',
  'chart-5',
  'success',
  'warning',
  'destructive',
  'info',
  'neutral',
] as const

/**
 * Dot color of a {@link LegendDot}, mapped to theme tokens: `chart-1`…`chart-5` match chart series,
 * the status tones match the status components, `neutral` is a muted gray for "other" series.
 */
export type LegendDotTone = (typeof LEGEND_DOT_TONES)[number]

/** Props of {@link LegendDot}. */
export interface LegendDotProps extends React.ComponentProps<'span'> {
  /** Dot color. Defaults to `brand`. Match it to the color of the series it labels. */
  tone?: LegendDotTone
  /** Extra classes for the dot itself (another `bg-*` token class, `bg-brand/50`…). */
  dotClassName?: string
  /** Series name, 1–2 words. Rendered UPPERCASE. */
  children?: React.ReactNode
}

const LEGEND_DOT: Record<LegendDotTone, string> = {
  brand: 'bg-brand',
  'chart-1': 'bg-chart-1',
  'chart-2': 'bg-chart-2',
  'chart-3': 'bg-chart-3',
  'chart-4': 'bg-chart-4',
  'chart-5': 'bg-chart-5',
  success: 'bg-success',
  warning: 'bg-warning',
  destructive: 'bg-destructive',
  info: 'bg-info',
  neutral: 'bg-foreground-muted',
}

/**
 * Chart legend item: a 6px colored dot + an UPPERCASE monospace caption (`● REQUESTS`).
 *
 * Use it in a `MetricCard`'s `aside` or above a chart/bar to name a series. It inherits the text
 * color of its parent. Do NOT use it as a status indicator (use a status dot or badge).
 */
export function LegendDot({ tone = 'brand', dotClassName, className, children, ...props }: LegendDotProps) {
  return (
    <span
      data-slot="legend-dot"
      data-tone={tone}
      className={cn('inline-flex items-center gap-1.5 font-mono text-[11px] tracking-[0.06em] uppercase', className)}
      {...props}
    >
      <span aria-hidden="true" className={cn('size-1.5 shrink-0 rounded-full', LEGEND_DOT[tone], dotClassName)} />
      {children}
    </span>
  )
}
