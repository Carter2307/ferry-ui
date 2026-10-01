import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { Slot } from 'radix-ui'

import { cn } from "../../lib/utils"

/**
 * Class generator behind {@link Badge}. Use it to give a non-`span` element (or a
 * third-party component) the exact badge look without rendering `<Badge>`.
 *
 * Variants:
 * - `variant` — tone: `default` (neutral surface), `outline` (transparent), `success`,
 *   `warning`, `destructive`, `info` (soft tinted fills), `primary` (solid primary fill).
 * - `font` — `sans` (default) or `mono` for machine-ish tags (plan tiers, versions, regions).
 * - `shape` — `pill` (fully rounded, default) or `square` (4px-radius chip).
 * - `case` — `upper` (default, tracked caps) or `normal` for sentence-case text.
 */
const badgeVariants = cva(
  [
    'inline-flex h-5 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-full border px-2',
    'text-[10.5px] leading-none font-medium tracking-[0.04em] whitespace-nowrap uppercase',
    'focus-visible:ring-2 focus-visible:ring-ring outline-none',
    '[&>svg]:pointer-events-none [&>svg]:size-3',
  ],
  {
    variants: {
      variant: {
        default: 'border-border-strong bg-surface-200 text-foreground-light',
        outline: 'border-border-strong bg-transparent text-foreground-light',
        success: 'border-success/30 bg-success-soft text-success',
        warning: 'border-warning-border bg-warning-soft text-warning',
        destructive: 'border-destructive-border bg-destructive-soft text-destructive',
        info: 'border-info-border bg-info-soft text-info',
        primary: 'border-primary-solid-border bg-primary-solid text-primary-foreground',
      },
      font: {
        sans: '',
        mono: 'font-mono text-[10.5px] font-normal tracking-[0.06em]',
      },
      shape: {
        pill: 'rounded-full',
        square: 'rounded-sm',
      },
      case: {
        upper: 'uppercase',
        normal: 'normal-case tracking-normal',
      },
    },
    defaultVariants: { variant: 'default', font: 'sans', shape: 'pill', case: 'upper' },
  },
)

type BadgeVariantProps = VariantProps<typeof badgeVariants>

/** Props for {@link Badge}: every `<span>` prop plus the {@link badgeVariants} options. */
type BadgeProps = React.ComponentProps<'span'> & {
  /**
   * Tone. `default` (neutral surface) and `outline` (transparent) for neutral tags;
   * `success`, `warning`, `destructive`, `info` (soft tinted fills) to colour a tag;
   * `primary` (solid fill in the primary colour) sparingly, for emphasis such as "New".
   */
  variant?: BadgeVariantProps['variant']
  /** Typeface: `sans` (default) or `mono` for machine-like values (plan tiers, versions, regions, IDs). */
  font?: BadgeVariantProps['font']
  /** Corners: `pill` (fully rounded, default) or `square` (4px-radius chip). */
  shape?: BadgeVariantProps['shape']
  /** Letter case: `upper` (default, tracked caps) or `normal` for sentence-case text such as names. */
  case?: BadgeVariantProps['case']
  /** Render the single child element (e.g. an `<a>`) with badge styling instead of a `<span>`. */
  asChild?: boolean
}

/**
 * Tiny 20px-high label with a 1px border — uppercase and tracked by default.
 * Use it for short, static metadata: a plan tier, a version, a count, a tag.
 *
 * `default` / `outline` are the neutral tags; the tinted variants (`success`, `warning`,
 * `destructive`, `info`) colour a tag (e.g. a `warning` "Beta") and `primary` adds emphasis,
 * sparingly ("New"). For the state of a record use `StatusBadge`. Do NOT use it as a button
 * (use `Button` size `tiny`) or for long text — it never wraps.
 */
function Badge({ className, variant, font, shape, case: letterCase, asChild = false, ...props }: BadgeProps) {
  const Comp = asChild ? Slot.Root : 'span'
  return (
    <Comp
      data-slot="badge"
      data-variant={variant ?? 'default'}
      className={cn(badgeVariants({ variant, font, shape, case: letterCase }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants, type BadgeProps }
