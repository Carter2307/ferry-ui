import * as React from 'react'

import { cn } from '../../lib/utils'

/** Props of {@link Table}: every `<table>` attribute plus the two scroll-container hooks below. */
type TableProps = React.ComponentProps<'table'> & {
  /**
   * Classes for the bordered scroll container around the `<table>`. Use it to
   * cap the height (`max-h-80` for a scrolling body / sticky header), to drop
   * the shadow (`shadow-none`) inside a padded card section, or to drop the
   * whole frame (`rounded-none border-0 shadow-none`) when the table sits
   * edge to edge in a card.
   */
  containerClassName?: string
  /**
   * Extra attributes for the scroll container (`<div>`), e.g. `tabIndex`,
   * `role` and `aria-label` so keyboard users can focus and scroll a table
   * that has no focusable content, or a `ref` to read its scroll position.
   * Its `className` is merged before `containerClassName`.
   */
  containerProps?: Omit<React.ComponentProps<'div'>, 'children'>
}

/**
 * Data table: a native `<table>` inside a bordered, 8px-radius card container
 * that scrolls horizontally when the columns overflow. Headers are small
 * uppercase monospace labels on a faint fill; rows are 14px text with hairline
 * separators and a subtle hover.
 *
 * Use it for records people scan and compare by column (members, invoices,
 * API keys, orders). Do NOT use it for page layout, for key/value details
 * (use a description list or info tiles) or for a handful of items with no
 * shared columns (use a list or cards).
 *
 * `className` goes to the `<table>`; `containerClassName` / `containerProps`
 * go to the scroll container. Give the table an accessible name with
 * `aria-label` or a `<TableCaption>`.
 *
 * Sticky header recipe: `containerClassName="max-h-80"` (the container becomes
 * the vertical scroller) + `<TableHeader className="sticky top-0 z-10 …">`.
 * A table that scrolls but holds no link or button must be reachable by
 * keyboard: pass `containerProps={{ tabIndex: 0, role: 'region', 'aria-label': '…' }}`.
 */
function Table({ className, containerClassName, containerProps, ...props }: TableProps) {
  return (
    <div
      {...containerProps}
      data-slot="table-container"
      className={cn(
        'relative w-full overflow-x-auto rounded-lg border bg-surface-100 shadow-card outline-none focus-visible:ring-2 focus-visible:ring-ring',
        containerProps?.className,
        containerClassName,
      )}
    >
      <table data-slot="table" className={cn('w-full caption-bottom text-sm', className)} {...props} />
    </div>
  )
}

/**
 * Header section (`<thead>`) with the faint surface fill and a bottom
 * hairline. Put one `<TableRow>` of `<TableHead>` cells in it; give that row
 * `className="hover:bg-transparent"` so the header does not react to hover.
 */
function TableHeader({ className, ...props }: React.ComponentProps<'thead'>) {
  return <thead data-slot="table-header" className={cn('bg-surface-200 [&_tr]:border-b', className)} {...props} />
}

/**
 * Body section (`<tbody>`) holding the data rows. Removes the separator under
 * the last row so it does not double the container border. Empty, loading
 * and error states also live here as rows (one full-width `colSpan` cell);
 * `TableSkeletonRows`, `TableMessageRow` and `TableErrorRow` from
 * `patterns/table-states` are ready-made versions of them.
 */
function TableBody({ className, ...props }: React.ComponentProps<'tbody'>) {
  return <tbody data-slot="table-body" className={cn('[&_tr:last-child]:border-0', className)} {...props} />
}

/**
 * Footer section (`<tfoot>`) on the same faint fill as the header, in medium
 * weight. Use it for totals or aggregates that summarize the columns above;
 * not for pagination or actions (render those below the table).
 */
function TableFooter({ className, ...props }: React.ComponentProps<'tfoot'>) {
  return (
    <tfoot
      data-slot="table-footer"
      className={cn('border-t bg-surface-200 font-medium [&>tr]:last:border-b-0', className)}
      {...props}
    />
  )
}

/**
 * Table row (`<tr>`) with a hairline separator and a subtle hover fill.
 *
 * - Set `data-state="selected"` to highlight a selected row.
 * - The row also stays highlighted while a descendant has
 *   `aria-expanded="true"` (e.g. its actions menu is open).
 * - For whole-row navigation, spread `rowLinkProps()` from
 *   `patterns/table-utils` and keep a real link in the first cell.
 */
function TableRow({ className, ...props }: React.ComponentProps<'tr'>) {
  return (
    <tr
      data-slot="table-row"
      className={cn(
        'border-b transition-colors hover:bg-surface-200 has-aria-expanded:bg-surface-200 data-[state=selected]:bg-selection',
        className,
      )}
      {...props}
    />
  )
}

/**
 * Column header cell (`<th>`): 36px tall, 11.5px uppercase monospace label in
 * the lighter foreground, never wrapping. Add `text-right` over numeric
 * columns, `w-[1%]` to shrink a column to its content, and put an
 * `sr-only` label in header cells of icon-only columns (e.g. "Actions").
 * A cell holding a `role="checkbox"` control loses its right padding.
 */
function TableHead({ className, ...props }: React.ComponentProps<'th'>) {
  return (
    <th
      data-slot="table-head"
      className={cn(
        'h-9 px-4 text-left align-middle font-mono text-[11.5px] font-normal tracking-[0.06em] whitespace-nowrap text-foreground-lighter uppercase',
        '[&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]',
        className,
      )}
      {...props}
    />
  )
}

/**
 * Data cell (`<td>`): at least 44px tall, 16px horizontal padding, no
 * wrapping by default. For long values, let one column absorb the free space
 * with `w-full max-w-0` and `truncate` the content inside it (add a `title`
 * with the full value), or opt back into wrapping with `whitespace-normal`.
 * Numbers read best with `tabular text-right`.
 */
function TableCell({ className, ...props }: React.ComponentProps<'td'>) {
  return (
    <td
      data-slot="table-cell"
      className={cn(
        'h-11 px-4 py-2 align-middle whitespace-nowrap text-foreground [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]',
        className,
      )}
      {...props}
    />
  )
}

/**
 * Visible caption (`<caption>`), rendered under the rows in small lighter
 * text; it also gives the table its accessible name. Use it for a short note
 * about the data ("Amounts in USD"). When no visible caption is wanted, pass
 * `aria-label` to `<Table>` instead.
 */
function TableCaption({ className, ...props }: React.ComponentProps<'caption'>) {
  return (
    <caption data-slot="table-caption" className={cn('mt-3 text-[13px] text-foreground-lighter', className)} {...props} />
  )
}

export { Table, TableHeader, TableBody, TableFooter, TableHead, TableRow, TableCell, TableCaption, type TableProps }
