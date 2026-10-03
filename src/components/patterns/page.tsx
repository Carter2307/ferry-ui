import * as React from 'react'
import { ArrowLeft } from 'lucide-react'

import { useLinkComponent, type LinkComponent, type LinkComponentProps } from '../../lib/link'
import { cn } from '../../lib/utils'

const widths = {
  narrow: 'max-w-[848px]',
  default: 'max-w-[1248px]',
  full: 'max-w-none',
} as const

/**
 * Max width of a {@link PageContainer}: `narrow` ≈ 800px of content (settings, detail and form pages),
 * `default` ≈ 1200px (overviews, lists, dashboards), `full` = no max width (logs, wide tables, editors).
 */
export type PageContainerSize = keyof typeof widths

/** Props of {@link PageContainer}: every `<div>` prop plus `size`. */
export interface PageContainerProps extends React.ComponentProps<'div'> {
  /** Max content width (default `default`). See {@link PageContainerSize}. */
  size?: PageContainerSize
}

/**
 * The centered content column of a page, with the standard responsive side padding
 * (16 → 24 → 40px), top padding and generous bottom padding.
 *
 * Use it once per page, inside the app shell's scrollable main area, and put a {@link PageHeader}
 * followed by {@link PageSection}s (or a list) in it. Pick `size="narrow"` for settings and forms,
 * `default` for overviews and lists, `full` for edge-to-edge tools. Do NOT nest containers.
 */
export function PageContainer({ size = 'default', className, ...props }: PageContainerProps) {
  return (
    <div
      data-slot="page-container"
      data-size={size}
      className={cn('mx-auto w-full px-4 pt-6 pb-16 sm:px-6 md:pt-8 lg:px-10', widths[size], className)}
      {...props}
    />
  )
}

/** Props of {@link PageHeader}. Extra `<header>` props go to the root element. */
export interface PageHeaderProps extends Omit<React.ComponentProps<'header'>, 'title'> {
  /** Page title, rendered as the page's `<h1>` (truncated on one line). */
  title: React.ReactNode
  /** One-sentence subtitle under the title (lighter foreground). */
  description?: React.ReactNode
  /** Small badges next to the title (a `Beta` tag, a status badge). */
  badges?: React.ReactNode
  /** Right-aligned toolbar: secondary buttons first, the page's primary action last. */
  actions?: React.ReactNode
  /**
   * Small line above the title (13px, lighter foreground): a {@link PageBackLink} to the parent
   * list on a detail or create page, or a `Breadcrumb` for deeper hierarchies.
   */
  eyebrow?: React.ReactNode
  /**
   * `md` (default): 24 → 26px title for list, overview and settings pages.
   * `lg`: 26 → 32px title (and 16px description) for the home page of a single record.
   */
  size?: 'md' | 'lg'
  /** Extra content under the title row (tabs, a stat strip, a callout). */
  children?: React.ReactNode
}

/**
 * The title block at the top of a page: optional eyebrow (typically a {@link PageBackLink}), then
 * the `<h1>` title (+ badges) and description on the left, actions on the right (stacked below
 * `sm`), then optional children.
 *
 * Use exactly one per page, as the first child of {@link PageContainer}. Do NOT use it for
 * sections inside a page (use {@link PageSection}) or inside cards and dialogs.
 */
export function PageHeader({
  title,
  description,
  badges,
  actions,
  eyebrow,
  size = 'md',
  className,
  children,
  ...props
}: PageHeaderProps) {
  return (
    <header data-slot="page-header" className={cn('mb-6 flex flex-col gap-4 md:mb-8', className)} {...props}>
      {eyebrow && <div className="text-[13px] text-foreground-lighter">{eyebrow}</div>}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 flex-col gap-1.5">
          <div className="flex min-w-0 flex-wrap items-center gap-2.5">
            <h1
              className={cn(
                'min-w-0 truncate font-medium tracking-[-0.01em] text-foreground',
                size === 'lg' ? 'text-[26px] leading-tight md:text-[32px]' : 'text-2xl leading-tight md:text-[26px]',
              )}
            >
              {title}
            </h1>
            {badges}
          </div>
          {description && (
            <div className={cn('text-foreground-light', size === 'lg' ? 'text-base' : 'text-sm')}>{description}</div>
          )}
        </div>
        {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
      </div>
      {children}
    </header>
  )
}

/** Props of {@link PageBackLink}: every `<a>` prop, plus a required `href` and an optional router adapter. */
export interface PageBackLinkProps extends LinkComponentProps {
  /** Destination: the parent page (usually the list this record belongs to). */
  href: string
  /** Name of the parent page, without an arrow or "Back to" (`Customers`, `All invoices`). */
  children: React.ReactNode
  /**
   * Link component for this link only, overriding the one from the nearest `LinkProvider`
   * (a plain `<a>` by default). Usually you set a `LinkProvider` once at the app root instead.
   */
  linkComponent?: LinkComponent
}

/**
 * The "← Parent" link above the title of a detail or create page: a left arrow and the parent
 * page's name, 13px lighter foreground that brightens on hover, with a focus ring. It renders
 * through the ferry-ui link contract (the nearest `LinkProvider`'s component or `linkComponent`).
 *
 * Put it in {@link PageHeader}'s `eyebrow`. Do NOT use it for browser-history "back" buttons
 * (it always points at a fixed parent `href`), or when the hierarchy is deeper than one level
 * (use a `Breadcrumb` in `eyebrow` instead).
 */
export function PageBackLink({ href, linkComponent, className, children, ...props }: PageBackLinkProps) {
  const Link = useLinkComponent(linkComponent)
  return (
    // `Link` comes from props/context (useLinkComponent): stable, not created during render.
    // eslint-disable-next-line react-hooks/static-components
    <Link
      data-slot="page-back-link"
      href={href}
      className={cn(
        // `-mx-1 px-1`: the focus ring gets 4px of room on each side without moving the text.
        '-mx-1 inline-flex w-fit items-center gap-1.5 rounded-sm px-1 text-[13px] text-foreground-lighter outline-none transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring',
        className,
      )}
      {...props}
    >
      <ArrowLeft className="size-3.5 shrink-0" aria-hidden="true" />
      {children}
    </Link>
  )
}

/** Props of {@link PageSection}: every `<section>` prop (use `id` for in-page anchors) plus the ones below. */
export interface PageSectionProps extends Omit<React.ComponentProps<'section'>, 'title'> {
  /** Section heading, rendered as an `<h2>` (18 → 20px medium) that also labels the section. */
  title?: React.ReactNode
  /** One-sentence explanation under the heading. */
  description?: React.ReactNode
  /** Compact controls aligned with the heading on the right (a "View all" link, an "Add" button). */
  actions?: React.ReactNode
}

/**
 * A titled block of a page: heading + description + actions, then its content (cards, a table, a
 * FormCard…), with 40px between consecutive sections.
 *
 * Use it to split a page into topics ("General", "Billing", "Danger zone"); give it an `id` to deep-link.
 * Do NOT use it for the page title (use {@link PageHeader}) or for grouping rows inside a card.
 */
export function PageSection({ title, description, actions, className, children, ...props }: PageSectionProps) {
  const headingId = React.useId()
  return (
    <section
      data-slot="page-section"
      aria-labelledby={title ? headingId : undefined}
      className={cn('mb-10 flex flex-col gap-4 last:mb-0', className)}
      {...props}
    >
      {(title || description || actions) && (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex min-w-0 flex-col gap-1">
            {title && (
              <h2 id={headingId} className="text-lg font-medium text-foreground md:text-xl">
                {title}
              </h2>
            )}
            {description && <p className="text-sm text-foreground-light">{description}</p>}
          </div>
          {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
        </div>
      )}
      {children}
    </section>
  )
}
