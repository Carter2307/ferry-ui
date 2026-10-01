import * as React from 'react'

import { Skeleton } from '../primitives/skeleton'
import { cn } from '../../lib/utils'

import { IconBox } from './icon-box'
import { MonoLabel } from './mono-label'

/** Props of {@link InfoTile}. */
export interface InfoTileProps extends Omit<React.ComponentProps<'div'>, 'children'> {
  /** Icon shown in an `xl` {@link IconBox} on the left (sized to 20px automatically). Omit for a text-only tile. */
  icon?: React.ReactNode
  /** Short caption rendered as a {@link MonoLabel} (1–3 words: "Plan", "Owner", "Timezone"). */
  label: React.ReactNode
  /**
   * Main value. Plain text, or a small inline node (badge, link, value + copy button). Truncated to
   * one line: add a `title` on long text. Can be omitted while `loading`.
   */
  value?: React.ReactNode
  /** Optional secondary line under the value ("Renews on May 4", "of 10 seats"). Truncated to one line. */
  hint?: React.ReactNode
  /** Shows a skeleton instead of the value, hides the hint and sets `aria-busy`. */
  loading?: boolean
}

/** True for nodes that render something (0 counts; null, undefined, false and '' do not). */
function hasContent(node: React.ReactNode): boolean {
  return node !== undefined && node !== null && node !== false && node !== ''
}

/**
 * Overview tile: a square outlined icon box + mono label + value (+ optional hint line).
 *
 * Use it in a responsive grid (`grid gap-x-8 gap-y-6 sm:grid-cols-2`) at the top of a detail or
 * overview page to summarise the key facts of an entity (status, plan, owner, timezone, created
 * date…). It has no border of its own. Do NOT use it for numeric KPIs you want to compare or chart
 * (use `MetricCard`), nor for long key/value lists (use `DescriptionList`).
 */
export function InfoTile({ icon, label, value, hint, loading = false, className, ...props }: InfoTileProps) {
  return (
    <div
      data-slot="info-tile"
      aria-busy={loading || undefined}
      className={cn('flex min-w-0 items-center gap-4', className)}
      {...props}
    >
      {hasContent(icon) && (
        <IconBox size="xl" data-slot="info-tile-icon">
          {icon}
        </IconBox>
      )}
      <div className="flex min-w-0 flex-col gap-1">
        <MonoLabel>{label}</MonoLabel>
        {loading ? (
          <Skeleton className="h-5 w-28" />
        ) : (
          <div data-slot="info-tile-value" className="min-w-0 truncate text-[15px] text-foreground md:text-[17px]">
            {value}
          </div>
        )}
        {!loading && hasContent(hint) && (
          <div data-slot="info-tile-hint" className="truncate text-[13px] text-foreground-lighter">
            {hint}
          </div>
        )}
      </div>
    </div>
  )
}
