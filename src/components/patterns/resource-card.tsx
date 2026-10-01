import * as React from 'react'

import { Skeleton } from '../primitives/skeleton'
import { useLinkComponent, type LinkComponent } from '../../lib/link'
import { cn } from '../../lib/utils'

/* -------------------------------------------------------------------------------------------------
 * ResourceGrid
 * -----------------------------------------------------------------------------------------------*/

/**
 * Class string of {@link ResourceGrid}: an auto-filling responsive grid whose columns are at
 * least 248px wide (one column on narrow screens), with 16px gaps. Use it when you cannot render
 * `ResourceGrid` itself (e.g. on a third-party list component).
 */
export const resourceGridClassName =
  'grid grid-cols-[repeat(auto-fill,minmax(min(100%,var(--resource-grid-min,248px)),1fr))] gap-4'

/** Props of {@link ResourceGrid}. */
export interface ResourceGridProps extends React.ComponentProps<'ul'> {
  /**
   * Minimum column width before the grid wraps to fewer columns: a number of px (`200`) or any CSS
   * length (`'16rem'`). Defaults to 248px.
   */
  minItemWidth?: number | string
}

/**
 * Responsive `<ul>` grid for lists of {@link ResourceCard}s (projects, workspaces, integrations,
 * repositories…). Columns auto-fill at `minItemWidth` and collapse to one column on phones.
 *
 * Give it an `aria-label` ("Projects"), and `aria-busy` while it holds {@link ResourceCardSkeleton}s.
 * Do NOT use it for tabular data people compare column by column (use a `Table`), nor for
 * KPI tiles (use a plain grid of `MetricCard`s).
 */
export function ResourceGrid({ minItemWidth, className, style, ...props }: ResourceGridProps) {
  return (
    <ul
      data-slot="resource-grid"
      className={cn(resourceGridClassName, className)}
      style={
        minItemWidth === undefined
          ? style
          : ({
              '--resource-grid-min': typeof minItemWidth === 'number' ? `${minItemWidth}px` : minItemWidth,
              ...style,
            } as React.CSSProperties)
      }
      {...props}
    />
  )
}

/* -------------------------------------------------------------------------------------------------
 * ResourceCard
 * -----------------------------------------------------------------------------------------------*/

/** Props of {@link ResourceCard}. */
export interface ResourceCardProps extends Omit<React.HTMLAttributes<HTMLElement>, 'children'> {
  /** Name of the entity, 15px medium, truncated on one line. It is also the accessible name of the card link. */
  name: React.ReactNode
  /**
   * Where the card leads. The whole card becomes clickable through a stretched link rendered with
   * the {@link LinkComponent} (router adapter). Omit it for a static, non-clickable card.
   */
  href?: string
  /** Router-aware link used for `href`. Defaults to the nearest `LinkProvider` component, else a plain `<a>`. */
  linkComponent?: LinkComponent
  /** 16px line icon before the name (entity type or kind). Decorative. */
  icon?: React.ReactNode
  /**
   * Top-right slot, usually a ghost `icon-tiny` Button opening a DropdownMenu (⋮). It sits above the
   * stretched link, so clicking it never opens the card. Give its trigger an `aria-label`.
   */
  menu?: React.ReactNode
  /** Line under the name (source, owner, description…), 13px lighter text. Truncate long values yourself. */
  subtitle?: React.ReactNode
  /** Row of small tags, usually mono square `Badge`s (plan, region, version, counts). Wraps. */
  badges?: React.ReactNode
  /**
   * Bottom block pinned to the bottom of the card: an address/metadata line and a status row
   * (`StatusLine` + a timestamp). Any interactive element in it needs `relative z-10` to sit
   * above the stretched link.
   */
  footer?: React.ReactNode
  /** Element rendered: `li` (default, inside a {@link ResourceGrid}) or `div` for a standalone card. */
  as?: 'li' | 'div'
  /**
   * Element wrapping the name. Defaults to `h3`; pick the level that fits the page outline (`h2`
   * when the grid sits right under the page `h1`), or `div` when the cards must not be headings.
   */
  titleAs?: 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'div'
  /** Ref to the root element (`li` or `div`). */
  ref?: React.Ref<HTMLElement>
}

/**
 * Clickable entity card with one fixed anatomy: 20px padding, icon + name + ⋮ menu, subtitle,
 * badges, and a footer pinned to the bottom (min height 188px so a grid stays aligned).
 * The whole card opens `href` via a stretched link; hover lifts the border and background, and
 * keyboard focus rings the whole card.
 *
 * Use it for browsable collections of named things (projects, workspaces, integrations, API
 * clients) inside a {@link ResourceGrid}. Do NOT use it for dense lists people scan row by row
 * (use a `Table`), for KPI numbers (use `MetricCard`), or as a generic content container (use `Card`).
 */
export function ResourceCard({
  name,
  href,
  linkComponent,
  icon,
  menu,
  subtitle,
  badges,
  footer,
  as = 'li',
  titleAs = 'h3',
  className,
  ref,
  ...props
}: ResourceCardProps) {
  const Link = useLinkComponent(linkComponent)
  const interactive = href !== undefined
  // Every allowed element accepts these props; the casts only narrow the unions for JSX.
  const Comp = as as 'li'
  const Title = titleAs as 'h3'
  return (
    <Comp
      ref={ref as React.Ref<HTMLLIElement>}
      data-slot="resource-card"
      className={cn(
        'group/card relative flex min-h-[188px] flex-col rounded-lg border bg-surface-100 p-5 shadow-card transition-colors',
        interactive && [
          'hover:border-border-stronger hover:bg-surface-75 dark:hover:bg-surface-300',
          'has-[[data-card-link]:focus-visible]:ring-2 has-[[data-card-link]:focus-visible]:ring-ring',
        ],
        className,
      )}
      {...props}
    >
      <div data-slot="resource-card-header" className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2.5">
          {icon && (
            <span aria-hidden="true" className="flex shrink-0 text-foreground-lighter [&_svg]:size-4">
              {icon}
            </span>
          )}
          <Title
            data-slot="resource-card-title"
            className="min-w-0 truncate text-[15px] leading-6 font-medium text-foreground"
          >
            {interactive ? (
              // Stretched link: its ::after covers the whole card, so the card is one big link.
              // `Link` is a stable component from props/context (useLinkComponent), not created here.
              // eslint-disable-next-line react-hooks/static-components
              <Link
                href={href}
                data-slot="resource-card-link"
                data-card-link=""
                className="outline-none after:absolute after:inset-0 after:rounded-lg after:content-['']"
              >
                {name}
              </Link>
            ) : (
              name
            )}
          </Title>
        </div>
        {menu && (
          <div data-slot="resource-card-menu" className="relative z-10 -mt-0.5 -mr-1.5 shrink-0">
            {menu}
          </div>
        )}
      </div>

      {subtitle && (
        <div
          data-slot="resource-card-subtitle"
          className="mt-1 flex min-w-0 items-center gap-1.5 text-[13px] text-foreground-lighter"
        >
          {subtitle}
        </div>
      )}

      {badges && (
        <div data-slot="resource-card-badges" className="mt-3 flex flex-wrap items-center gap-1.5">
          {badges}
        </div>
      )}

      {footer && (
        <div data-slot="resource-card-footer" className="mt-auto flex min-w-0 flex-col gap-2.5 pt-5">
          {footer}
        </div>
      )}
    </Comp>
  )
}

/* -------------------------------------------------------------------------------------------------
 * ResourceCardSkeleton
 * -----------------------------------------------------------------------------------------------*/

/** Props of {@link ResourceCardSkeleton}. */
export interface ResourceCardSkeletonProps extends Omit<React.HTMLAttributes<HTMLElement>, 'children'> {
  /** Element rendered: `li` (default, inside a {@link ResourceGrid}) or `div`. Match the real cards. */
  as?: 'li' | 'div'
  /** Ref to the root element (`li` or `div`). */
  ref?: React.Ref<HTMLElement>
}

/**
 * Placeholder with the exact footprint of a {@link ResourceCard} (icon, name, subtitle, two badges,
 * footer line and status row), shown while a list loads. Hidden from assistive technology: mark
 * the {@link ResourceGrid} `aria-busy` instead. Render as many as the viewport typically shows (3–6).
 */
export function ResourceCardSkeleton({ as = 'li', className, ref, ...props }: ResourceCardSkeletonProps) {
  const Comp = as as 'li'
  return (
    <Comp
      ref={ref as React.Ref<HTMLLIElement>}
      data-slot="resource-card-skeleton"
      aria-hidden="true"
      className={cn('flex min-h-[188px] flex-col rounded-lg border bg-surface-100 p-5 shadow-card', className)}
      {...props}
    >
      <div className="flex items-center gap-2.5">
        <Skeleton className="size-4 rounded-sm" />
        <Skeleton className="h-4 w-28" />
      </div>
      <Skeleton className="mt-2.5 h-3.5 w-40" />
      <div className="mt-3.5 flex gap-1.5">
        <Skeleton className="h-5 w-10 rounded-sm" />
        <Skeleton className="h-5 w-12 rounded-sm" />
      </div>
      <div className="mt-auto flex flex-col gap-3 pt-5">
        <Skeleton className="h-3.5 w-36" />
        <div className="flex items-center gap-2">
          <Skeleton className="size-5 rounded-full" />
          <Skeleton className="h-3.5 w-24" />
        </div>
      </div>
    </Comp>
  )
}
