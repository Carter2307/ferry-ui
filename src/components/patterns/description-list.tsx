import * as React from 'react'

import { Skeleton } from '../primitives/skeleton'
import { useLinkComponent, type LinkComponent } from '../../lib/link'
import { cn } from '../../lib/utils'

/* -------------------------------------------------------------------------------------------------
 * Types & context
 * -----------------------------------------------------------------------------------------------*/

/**
 * Look of a {@link DescriptionList}:
 * - `grid` — bordered card of cells split by hairlines (mono label over the value). The default,
 *   for the facts block at the top of a detail page.
 * - `strip` — one row of cells split by vertical hairlines, flush at the bottom of a card.
 * - `rows` — full-width rows: icon + label on the left, value right-aligned; rows can be links.
 *   For a side panel or a card body.
 * - `inline` — compact two-column label/value list with no chrome, for popovers and menus.
 */
export type DescriptionListVariant = 'grid' | 'strip' | 'rows' | 'inline'

/** Number of columns of the `grid` and `strip` variants. */
export type DescriptionListColumns = 1 | 2 | 3 | 4

interface DescriptionListContextValue {
  variant: DescriptionListVariant
  columns: DescriptionListColumns
  divided: boolean
}

const DescriptionListContext = React.createContext<DescriptionListContextValue>({
  variant: 'grid',
  columns: 4,
  divided: true,
})

/* -------------------------------------------------------------------------------------------------
 * DescriptionList
 * -----------------------------------------------------------------------------------------------*/

const rootVariant: Record<DescriptionListVariant, string> = {
  // gap-px over a border-coloured backdrop draws the 1px separators between cells. The backdrop is
  // clipped to the padding box so the translucent border colour is not painted twice under the border.
  grid: 'grid gap-px overflow-hidden rounded-lg border bg-border bg-clip-padding shadow-card',
  strip: 'grid border-t text-[13px]',
  rows: 'flex flex-col',
  inline: 'grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-[13px]',
}

const gridColumns: Record<DescriptionListColumns, string> = {
  1: 'grid-cols-1',
  2: 'grid-cols-1 sm:grid-cols-2',
  3: 'grid-cols-1 sm:grid-cols-3',
  4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
}

const stripColumns: Record<DescriptionListColumns, string> = {
  1: 'grid-cols-1',
  2: 'grid-cols-2',
  3: 'grid-cols-3',
  4: 'grid-cols-4',
}

/** Props of {@link DescriptionList}. */
export interface DescriptionListProps extends React.ComponentProps<'dl'> {
  /** Look of the list (see {@link DescriptionListVariant}). Defaults to `grid`. */
  variant?: DescriptionListVariant
  /**
   * Columns of the `grid` and `strip` variants (ignored by `rows` and `inline`). Defaults to 4.
   * `grid` is responsive: one column on phones, then 2 → `sm:2`, 3 → `sm:3`, 4 → `sm:2 lg:4`.
   * `strip` always uses exactly this many columns, so keep it to short values.
   */
  columns?: DescriptionListColumns
  /**
   * `rows` only. `true` (default) also draws a hairline above the first row, separating the
   * list from a header above it. Set `false` when the list is the first thing in its container.
   */
  divided?: boolean
  /** {@link DescriptionItem} elements. */
  children?: React.ReactNode
}

/**
 * Read-only label/value "facts" about ONE record, rendered as a semantic `<dl>`: an invoice's
 * status, dates and amounts, a member's role and timezone, an API key's scopes. Pick the look with
 * `variant` (`grid` cells, `strip` footer, `rows` list, `inline` compact) and fill it with
 * {@link DescriptionItem}s; the variant reaches the items automatically.
 *
 * Do NOT use it for editable settings (use `FormCard` / `FormRow`), for a single headline number
 * (use `MetricCard`), for icon tiles in a page overview (use `InfoTile`) or for many records
 * (use `Table`). In the `grid` variant, fill every row (or use `span`) so no empty
 * border-coloured cell shows.
 */
export function DescriptionList({
  variant = 'grid',
  columns = 4,
  divided = true,
  className,
  children,
  ...props
}: DescriptionListProps) {
  const context = React.useMemo(() => ({ variant, columns, divided }), [variant, columns, divided])
  return (
    <DescriptionListContext.Provider value={context}>
      <dl
        data-slot="description-list"
        data-variant={variant}
        className={cn(
          rootVariant[variant],
          variant === 'grid' && gridColumns[columns],
          variant === 'strip' && stripColumns[columns],
          className,
        )}
        {...props}
      >
        {children}
      </dl>
    </DescriptionListContext.Provider>
  )
}

/* -------------------------------------------------------------------------------------------------
 * DescriptionItem
 * -----------------------------------------------------------------------------------------------*/

/** Width of a `grid` cell: 1 column (default), 2 columns from `sm` up, or the full row. */
export type DescriptionItemSpan = 1 | 2 | 'full'

/** Props of {@link DescriptionItem}. */
export interface DescriptionItemProps extends Omit<React.ComponentProps<'div'>, 'children'> {
  /** Short caption (1–3 words: "Status", "Issued", "Billing email"). Rendered in the `<dt>`. */
  label: React.ReactNode
  /**
   * The value, rendered in the `<dd>` and truncated to one line (unless `wrap`): put long text in
   * `<span title={…}>` so the full value stays reachable. `undefined`, `null`, `false` and `''`
   * render a muted "—" (0 is shown as is).
   */
  children?: React.ReactNode
  /** Sets the value in the monospace font at 13px: IDs, hashes, versions, URLs, keys. */
  mono?: boolean
  /**
   * Lets a long value wrap onto several lines instead of truncating it to one: a description, a
   * postal address, a full URL or command. Meant for the `grid` variant, paired with `span`; the
   * other variants are built for short values. Defaults to `false`.
   */
  wrap?: boolean
  /** `rows` only. Decorative 16px icon before the label (any `svg` is sized automatically). */
  icon?: React.ReactNode
  /** `rows` only. Muted secondary text before the value ("3 active", "of 10"). Hidden on phones. */
  hint?: React.ReactNode
  /**
   * `grid` only. Cell width: `2` spans two columns from `sm` up (for long values such as a URL or
   * an address), `'full'` spans the whole row. Defaults to 1.
   */
  span?: DescriptionItemSpan
  /**
   * `rows` only. Turns the whole row into a link to this URL (hover and focus highlight). The label
   * is the link text and the value its accessible description. Keep other interactive elements
   * (buttons, copy actions) out of a linked row: the link covers the whole row.
   */
  href?: string
  /** Router link used when `href` is set. Defaults to the one from `LinkProvider` (a plain `<a>`). */
  linkComponent?: LinkComponent
  /**
   * Shows a skeleton while the value loads and sets `aria-busy`. `rows` and `inline` keep the label;
   * `grid` and `strip` skeleton the label too (the label stays available to screen readers).
   */
  loading?: boolean
  /** Extra classes for the `<dd>` (e.g. `text-warning`, `flex items-center gap-1.5`). */
  valueClassName?: string
}

/** True for nodes that render something (0 counts; null, undefined, false and '' do not). */
function hasContent(node: React.ReactNode): boolean {
  return node !== undefined && node !== null && node !== false && node !== ''
}

const itemVariant: Record<DescriptionListVariant, string> = {
  grid: 'flex min-w-0 flex-col gap-1 bg-surface-100 px-4 py-3.5 md:px-5',
  strip: 'flex min-w-0 flex-col gap-0.5 px-4 py-3',
  rows: 'relative flex min-h-11 items-center gap-3 border-t px-4 py-2.5',
  inline: 'contents',
}

const labelVariant: Record<DescriptionListVariant, string> = {
  grid: 'mono-label',
  strip: 'mono-label truncate',
  rows: 'flex min-w-0 flex-1 items-center gap-3 text-[13px] text-foreground-light',
  inline: 'text-foreground-lighter',
}

// Truncation (or wrapping) is added per item; in `rows` it applies to the inner value span.
const valueVariant: Record<DescriptionListVariant, string> = {
  grid: 'min-w-0 text-sm text-foreground',
  strip: 'min-w-0 text-foreground tabular',
  rows: 'flex min-w-0 items-baseline gap-1.5 text-right text-[13px] text-foreground tabular',
  inline: 'min-w-0 text-right text-foreground',
}

/*
 * Strip dividers: a vertical hairline before every cell that does not start a row, and a
 * horizontal one above every row after the first (only matters when items > columns).
 */
const stripDividers: Record<DescriptionListColumns, string> = {
  1: '[&:not(:first-child)]:border-t',
  2: '[&:not(:nth-child(2n+1))]:border-l [&:nth-child(n+3)]:border-t',
  3: '[&:not(:nth-child(3n+1))]:border-l [&:nth-child(n+4)]:border-t',
  4: '[&:not(:nth-child(4n+1))]:border-l [&:nth-child(n+5)]:border-t',
}

function gridSpan(span: DescriptionItemSpan, columns: DescriptionListColumns): string | undefined {
  if (span === 'full') return 'col-span-full'
  // The grid collapses to one column on phones, so a 2-column span only applies from `sm` up.
  if (span === 2 && columns > 1) return 'sm:col-span-2'
  return undefined
}

const linkedRow =
  'transition-colors hover:bg-surface-200 has-[[data-slot=description-item-link]:focus-visible]:bg-surface-200 has-[[data-slot=description-item-link]:focus-visible]:ring-2 has-[[data-slot=description-item-link]:focus-visible]:ring-ring has-[[data-slot=description-item-link]:focus-visible]:ring-inset'

/**
 * One label/value pair of a {@link DescriptionList}: renders `<div><dt>label</dt><dd>value</dd></div>`
 * styled for the list's `variant`. The value is its children; an empty value shows a muted "—".
 *
 * Use `mono` for identifiers, `wrap` for long text, `loading` while data is fetched, and — per
 * variant — `span` (`grid`), `icon`, `hint` and `href` (`rows`). Do NOT use it outside a `DescriptionList` (it falls back to
 * the `grid` look) nor for editable fields (use `FormRow`).
 */
export function DescriptionItem({
  label,
  children,
  mono = false,
  wrap = false,
  icon,
  hint,
  span = 1,
  href,
  linkComponent,
  loading = false,
  valueClassName,
  className,
  ...props
}: DescriptionItemProps) {
  const { variant, columns, divided } = React.useContext(DescriptionListContext)
  const Link = useLinkComponent(linkComponent)
  const valueId = React.useId()
  const isRows = variant === 'rows'
  const isLink = isRows && href !== undefined
  const cellSkeleton = loading && (variant === 'grid' || variant === 'strip')
  const overflow = wrap ? 'break-words' : 'truncate'

  const empty = <span className="text-foreground-lighter">—</span>
  const value = hasContent(children) ? children : empty

  let labelContent: React.ReactNode = label
  if (cellSkeleton) {
    labelContent = (
      <>
        <Skeleton className="h-3 w-16 max-w-full" />
        <span className="sr-only">{label}</span>
      </>
    )
  } else if (isRows) {
    labelContent = (
      <>
        {hasContent(icon) && (
          <span
            aria-hidden="true"
            data-slot="description-item-icon"
            className="flex size-4 shrink-0 items-center justify-center text-foreground-lighter [&_svg]:size-4"
          >
            {icon}
          </span>
        )}
        {isLink ? (
          // `Link` is a stable component from props/context (useLinkComponent), not created here.
          // eslint-disable-next-line react-hooks/static-components
          <Link
            href={href}
            // The link text is the label; the value is announced as its description.
            aria-describedby={valueId}
            data-slot="description-item-link"
            // The ::after overlay stretches the link over the whole row (valid HTML: the <a> stays in the <dt>).
            className="min-w-0 truncate outline-none after:absolute after:inset-0"
          >
            {label}
          </Link>
        ) : (
          <span className="min-w-0 truncate">{label}</span>
        )}
      </>
    )
  }

  let valueContent: React.ReactNode = value
  if (loading) {
    valueContent = (
      <Skeleton
        className={cn(
          variant === 'rows' && 'h-4 w-14',
          variant === 'inline' && 'ml-auto h-4 w-14',
          (variant === 'grid' || variant === 'strip') && 'h-4 w-24 max-w-full',
        )}
      />
    )
  } else if (isRows) {
    valueContent = (
      <>
        {hasContent(hint) && (
          <span data-slot="description-item-hint" className="hidden text-[12px] text-foreground-lighter sm:inline">
            {hint}
          </span>
        )}
        {/* Not rendered (flex gap spaces the items); it keeps "2 pending 18" apart when read aloud. */}
        {hasContent(hint) && ' '}
        {/* `mono` styles the value only, not the hint. */}
        <span className={cn('min-w-0', overflow, mono && 'font-mono')}>{value}</span>
      </>
    )
  }

  return (
    <div
      data-slot="description-item"
      aria-busy={loading || undefined}
      className={cn(
        itemVariant[variant],
        variant === 'grid' && gridSpan(span, columns),
        variant === 'grid' && loading && 'gap-2',
        variant === 'strip' && stripDividers[columns],
        isRows && !divided && 'first:border-t-0',
        isLink && linkedRow,
        className,
      )}
      {...props}
    >
      <dt data-slot="description-item-label" className={labelVariant[variant]}>
        {labelContent}
      </dt>
      <dd
        id={isLink ? valueId : undefined}
        data-slot="description-item-value"
        className={cn(
          valueVariant[variant],
          !isRows && overflow,
          mono && !isRows && 'font-mono text-[13px]',
          valueClassName,
        )}
      >
        {valueContent}
      </dd>
    </div>
  )
}
