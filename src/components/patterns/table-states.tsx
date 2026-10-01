import * as React from 'react'
import { RefreshCw } from 'lucide-react'

import { Button } from '../primitives/button'
import { Skeleton } from '../primitives/skeleton'
import { TableCell, TableRow } from '../primitives/table'
import { getErrorMessage } from '../../lib/errors'
import { cn } from '../../lib/utils'

/* -------------------------------------------------------------------------------------------------
 * TableSkeletonRows
 * -----------------------------------------------------------------------------------------------*/

/**
 * Props of {@link TableSkeletonRows}. Other `<tr>` props (`data-*`, `aria-*`…) are applied to every
 * placeholder row, which is why `ref` and `id` are not accepted.
 */
export interface TableSkeletonRowsProps extends Omit<React.ComponentProps<'tr'>, 'children' | 'ref' | 'id'> {
  /** Number of cells per row: the number of columns of the table (`<TableHead>` count). */
  columns: number
  /** Number of placeholder rows. Match the expected page size when known, capped to a few rows. Defaults to 4. */
  rows?: number
  /** Classes merged onto every placeholder `<TableRow>`. */
  className?: string
}

/**
 * Placeholder rows shown in a `<TableBody>` while the table's data loads: one pulsing bar per cell,
 * wide in the first column, narrow in the last (usually actions or amounts), medium in between, so the
 * layout does not jump when rows arrive. Rows do not react to hover.
 *
 * Put it inside the real `<Table>` with its real header, and set `aria-busy` on the `<TableBody>`
 * (the skeletons themselves are hidden from assistive technology). Do NOT use it for background
 * refetches when rows are already on screen (keep the rows), nor outside a table (use `Skeleton`).
 */
export function TableSkeletonRows({ columns, rows = 4, className, ...props }: TableSkeletonRowsProps) {
  return (
    <>
      {Array.from({ length: rows }, (_, r) => (
        <TableRow key={r} data-slot="table-skeleton-row" className={cn('hover:bg-transparent', className)} {...props}>
          {Array.from({ length: columns }, (_, c) => (
            <TableCell key={c}>
              <Skeleton className={cn('h-4', c === 0 ? 'w-32' : c === columns - 1 ? 'w-12' : 'w-20')} />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  )
}

/* -------------------------------------------------------------------------------------------------
 * TableMessageRow
 * -----------------------------------------------------------------------------------------------*/

/** Props of {@link TableMessageRow}. Other `<tr>` props (`ref`, `id`, `data-*`, `aria-*`…) go to the row. */
export interface TableMessageRowProps extends Omit<React.ComponentProps<'tr'>, 'children' | 'className'> {
  /** Number of columns the single cell spans: the number of columns of the table. */
  colSpan: number
  /** The message (and, if useful, a small action such as a "Clear filters" link button). Wraps when long. */
  children: React.ReactNode
  /**
   * `neutral` (default) = lighter foreground for empty states; `destructive` = red text for failures
   * (the tone vocabulary of the library). Prefer {@link TableErrorRow} for load errors. `muted` is a
   * deprecated alias of `neutral`.
   */
  tone?: 'neutral' | 'destructive' | 'muted'
  /** Classes merged onto the full-width `<TableCell>` (e.g. `h-32` for a taller empty area). */
  className?: string
}

/**
 * A single full-width, centered, 96px-tall row inside a `<TableBody>` for "nothing to show" messages:
 * no rows yet, no rows matching the filters, a related list that is empty. Keeps the table header
 * visible so the user still sees what the table would contain.
 *
 * Use it for empty tables and short messages. Do NOT use it outside a table (use `EmptyState`), and
 * prefer {@link TableErrorRow} for failures (it reads the error's message for you).
 */
export function TableMessageRow({ colSpan, children, tone = 'neutral', className, ...props }: TableMessageRowProps) {
  return (
    <TableRow data-slot="table-message-row" className="hover:bg-transparent" {...props}>
      <TableCell
        colSpan={colSpan}
        className={cn(
          'h-24 text-center whitespace-normal',
          tone === 'destructive' ? 'text-destructive' : 'text-foreground-light',
          className,
        )}
      >
        {children}
      </TableCell>
    </TableRow>
  )
}

/* -------------------------------------------------------------------------------------------------
 * TableErrorRow
 * -----------------------------------------------------------------------------------------------*/

/** Props of {@link TableErrorRow}. Other `<tr>` props (`ref`, `id`, `data-*`, `aria-*`…) go to the row. */
export interface TableErrorRowProps extends Omit<React.ComponentProps<'tr'>, 'children' | 'className'> {
  /** Number of columns the single cell spans: the number of columns of the table. */
  colSpan: number
  /** What was thrown or rejected; its message is shown through `getErrorMessage`. */
  error: unknown
  /** Shows a small Retry button under the message that calls it. */
  onRetry?: () => void
  /** Spinner on the Retry button while the new attempt runs. */
  retrying?: boolean
  /** Label of the Retry button. Defaults to "Retry". */
  retryLabel?: React.ReactNode
  /** Classes merged onto the full-width `<TableCell>`. */
  className?: string
}

/**
 * A {@link TableMessageRow} in the error tone that shows the message of a failed load (announced with
 * `role="alert"`), with an optional Retry button. The header stays visible.
 *
 * Use it when the table's rows failed to load. Do NOT use it when rows from an earlier load are still
 * on screen (keep them and show `StaleDataCallout` above the table), nor for errors of a single row's
 * action (use a toast).
 */
export function TableErrorRow({
  colSpan,
  error,
  onRetry,
  retrying,
  retryLabel = 'Retry',
  className,
  ...props
}: TableErrorRowProps) {
  return (
    <TableMessageRow colSpan={colSpan} tone="destructive" className={className} {...props}>
      <div data-slot="table-error-row" className="flex flex-col items-center gap-2">
        <span role="alert" className="break-words">
          {getErrorMessage(error)}
        </span>
        {onRetry && (
          <Button size="tiny" icon={<RefreshCw />} onClick={onRetry} loading={retrying}>
            {retryLabel}
          </Button>
        )}
      </div>
    </TableMessageRow>
  )
}
