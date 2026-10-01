import * as React from 'react'
import { ArrowUpRight } from 'lucide-react'

import { MonoLabel } from '../patterns/mono-label'
import { useLinkComponent, type LinkComponent } from '../../lib/link'
import { cn } from '../../lib/utils'

import type { NavGroup, NavItem } from './types'

/** Props of {@link InnerMenu}. */
export interface InnerMenuProps {
  /**
   * Sections of the menu, separated by hairline borders. A group `label` renders as an UPPERCASE
   * mono heading (usually omitted on the first group). Items are links when they have an `href`,
   * buttons calling `onSelect` otherwise; `external` items open in a new tab with a ↗. Item ids
   * must be unique across all groups (they key the mobile tab strip and match `value`).
   */
  groups: NavGroup[]
  /** Heading of the menu, shown in a 48px bar at the top (e.g. the name of the entity being viewed). */
  title?: React.ReactNode
  /**
   * Custom content rendered between the title bar and the groups (a switcher, a search field, a
   * back link). Omit `title` to make it the only header. Desktop menu only: the mobile tab strip
   * shows the items alone.
   */
  header?: React.ReactNode
  /** Content pinned under the groups (a help card, a danger-zone link). Desktop menu only. */
  footer?: React.ReactNode
  /**
   * Accessible name of the navigation landmark (the `<nav>` of the side menu and of the mobile tab
   * strip). Defaults to `title` when it is a string, else `"Section"`.
   */
  label?: string
  /**
   * Id of the current item, for menus that switch sections without a router (tabs-like). An item
   * is active when its own `active` flag is `true`, or — when that flag is unset — when its `id`
   * equals `value`. Route-driven menus usually set `active` on items instead. There is no
   * uncontrolled `defaultValue`: the menu does not render the sections, so the state that picks
   * the visible section (your router or your own `useState`) is the source of truth.
   */
  value?: string
  /**
   * Called with the item id when an item becomes the current section: a button, or a plain click
   * on an internal link. Not called for `external` links, nor for Cmd/Ctrl/Shift/Alt or
   * middle clicks (they open a new tab or window). Pair with `value`.
   */
  onValueChange?: (id: string) => void
  /**
   * Below the `md` breakpoint, replace the side menu with a horizontally scrolling tab strip that
   * keeps the active tab in view. Defaults to `true`; set `false` to always render the side menu.
   */
  mobileTabs?: boolean
  /** Router-aware link used for internal items. Defaults to the nearest `LinkProvider` (a plain `<a>`). */
  linkComponent?: LinkComponent
  /**
   * Screen-reader text appended to the name of `external` items. Defaults to
   * `"(opens in a new tab)"`; pass a translation in localized apps.
   */
  externalLabel?: string
  /** Extra classes for the side menu (`<aside>`), e.g. to change its width. */
  className?: string
}

/** Width of the edge fade of the mobile tab strip, in px (keep in sync with the mask classes). */
const FADE = 24

const rowBase =
  'group flex h-[30px] items-center gap-2 rounded-md px-3 text-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring'
const rowIdle = 'text-foreground-light hover:bg-surface-200 hover:text-foreground'
const rowActive = 'bg-selection font-medium text-foreground'

const pillBase =
  'inline-flex h-8 shrink-0 items-center rounded-full px-3 text-[13px] whitespace-nowrap outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset'

function isItemActive(item: NavItem, value: string | undefined): boolean {
  return item.active ?? (value !== undefined && item.id === value)
}

/** True for link clicks that open the target elsewhere (new tab or window) instead of in place. */
function opensElsewhere(event: React.MouseEvent<HTMLElement>): boolean {
  return event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey
}

type ChooseHandler = (item: NavItem, event: React.MouseEvent<HTMLElement>) => void

interface RowProps {
  item: NavItem
  active: boolean
  Link: LinkComponent
  externalLabel: string
  onChoose: ChooseHandler
}

/** One 30px row of the side menu: external link, internal link, action button or disabled row. */
function InnerMenuRow({ item, active, Link, externalLabel, onChoose }: RowProps) {
  const icon = item.icon ? (
    <span aria-hidden="true" className="text-foreground-lighter group-aria-[current=page]:text-foreground [&_svg]:size-4">
      {item.icon}
    </span>
  ) : null
  const label = <span className="truncate">{item.label}</span>

  if (item.disabled) {
    return (
      <span
        data-slot="inner-menu-item"
        role={item.href ? 'link' : undefined}
        aria-disabled="true"
        className={cn(rowBase, 'cursor-not-allowed text-foreground-light opacity-50')}
      >
        {icon}
        {label}
        {item.badge != null && <span className="ml-auto">{item.badge}</span>}
      </span>
    )
  }

  if (item.external && item.href) {
    return (
      <a
        data-slot="inner-menu-item"
        href={item.href}
        target="_blank"
        rel="noreferrer"
        onClick={(event) => onChoose(item, event)}
        className={cn(rowBase, rowIdle)}
      >
        {icon}
        {label}
        {item.badge}
        <ArrowUpRight className="ml-auto size-3.5 text-foreground-lighter" aria-hidden="true" />
        <span className="sr-only">{` ${externalLabel}`}</span>
      </a>
    )
  }

  const content = (
    <>
      {icon}
      {label}
      {item.badge != null && <span className="ml-auto">{item.badge}</span>}
    </>
  )

  if (item.href) {
    return (
      <Link
        data-slot="inner-menu-item"
        href={item.href}
        aria-current={active ? 'page' : undefined}
        onClick={(event) => onChoose(item, event)}
        className={cn(rowBase, active ? rowActive : rowIdle)}
      >
        {content}
      </Link>
    )
  }

  return (
    <button
      type="button"
      data-slot="inner-menu-item"
      aria-current={active ? 'page' : undefined}
      onClick={(event) => onChoose(item, event)}
      className={cn(rowBase, 'w-full cursor-pointer text-left', active ? rowActive : rowIdle)}
    >
      {content}
    </button>
  )
}

/** One pill of the mobile tab strip (label only, icons are dropped to save width). */
function InnerMenuPill({ item, active, Link, externalLabel, onChoose }: RowProps) {
  if (item.disabled) {
    return (
      <span
        data-slot="inner-menu-tab"
        role={item.href ? 'link' : undefined}
        aria-disabled="true"
        className={cn(pillBase, 'cursor-not-allowed gap-1.5 border border-transparent text-foreground-light opacity-50')}
      >
        {item.label}
        {item.badge}
      </span>
    )
  }

  if (item.external && item.href) {
    return (
      <a
        data-slot="inner-menu-tab"
        href={item.href}
        target="_blank"
        rel="noreferrer"
        onClick={(event) => onChoose(item, event)}
        className={cn(pillBase, 'gap-1 text-foreground-light hover:bg-surface-200')}
      >
        {item.label}
        <ArrowUpRight className="size-3" aria-hidden="true" />
        <span className="sr-only">{` ${externalLabel}`}</span>
      </a>
    )
  }

  const className = cn(
    pillBase,
    'gap-1.5 border transition-colors',
    active
      ? 'border-border-strong bg-selection font-medium text-foreground'
      : 'border-transparent text-foreground-light hover:bg-surface-200 hover:text-foreground',
  )

  if (item.href) {
    return (
      <Link
        data-slot="inner-menu-tab"
        href={item.href}
        aria-current={active ? 'page' : undefined}
        onClick={(event) => onChoose(item, event)}
        className={className}
      >
        {item.label}
        {item.badge}
      </Link>
    )
  }

  return (
    <button
      type="button"
      data-slot="inner-menu-tab"
      aria-current={active ? 'page' : undefined}
      onClick={(event) => onChoose(item, event)}
      className={cn(className, 'cursor-pointer')}
    >
      {item.label}
      {item.badge}
    </button>
  )
}

interface TabStripProps {
  items: NavItem[]
  label: string
  value: string | undefined
  Link: LinkComponent
  externalLabel: string
  onChoose: ChooseHandler
}

/**
 * Phone version of the menu: a horizontally scrolling pill strip. The active pill is scrolled into
 * view whenever the active item changes, and the edges fade out while there are more pills to
 * scroll to.
 */
function InnerMenuTabStrip({ items, label, value, Link, externalLabel, onChoose }: TabStripProps) {
  const scroller = React.useRef<HTMLDivElement>(null)
  const [edges, setEdges] = React.useState({ left: false, right: false })
  const activeKey = items
    .filter((item) => isItemActive(item, value))
    .map((item) => item.id)
    .join(' ')

  const measure = React.useCallback(() => {
    const el = scroller.current
    if (!el) return
    const left = el.scrollLeft > 1
    const right = el.scrollLeft + el.clientWidth < el.scrollWidth - 1
    setEdges((prev) => (prev.left === left && prev.right === right ? prev : { left, right }))
  }, [])

  // Keep the active pill visible, then measure the fades before paint. Scrolls only the strip
  // (scrollIntoView could also move the page vertically).
  React.useLayoutEffect(() => {
    const el = scroller.current
    const active = el?.querySelector<HTMLElement>('[aria-current="page"]')
    if (el && active) {
      const box = el.getBoundingClientRect()
      const pill = active.getBoundingClientRect()
      if (pill.left < box.left + FADE) el.scrollLeft -= box.left + FADE - pill.left
      else if (pill.right > box.right - FADE) el.scrollLeft += pill.right - (box.right - FADE)
    }
    measure()
  }, [activeKey, measure])

  // Re-measures whenever the strip resizes.
  React.useEffect(() => {
    const el = scroller.current
    if (!el || typeof ResizeObserver === 'undefined') return
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [measure])

  return (
    <nav
      data-slot="inner-menu-tabs"
      aria-label={label}
      className="sticky top-0 z-10 shrink-0 border-b bg-background md:hidden"
    >
      <div
        ref={scroller}
        onScroll={measure}
        data-fade-left={edges.left ? '' : undefined}
        data-fade-right={edges.right ? '' : undefined}
        className="flex gap-1 overflow-x-auto px-3 py-2 scrollbar-none data-[fade-left]:mask-l-from-[calc(100%-24px)] data-[fade-right]:mask-r-from-[calc(100%-24px)]"
      >
        {items.map((item) => (
          <InnerMenuPill
            key={item.id}
            item={item}
            active={isItemActive(item, value)}
            Link={Link}
            externalLabel={externalLabel}
            onChoose={onChoose}
          />
        ))}
      </div>
    </nav>
  )
}

/**
 * Secondary side menu for the sections of one area (an entity's pages, a settings area): an
 * optional 48px title bar, then groups separated by borders with UPPERCASE mono headings and 30px
 * rows (active row = selection fill, icon brightens). External items open in a new tab with a ↗.
 * Below `md` it turns into a horizontally scrolling tab strip (see `mobileTabs`).
 *
 * Place it as the first child of a `flex flex-col md:flex-row` container next to the scrolling
 * content; the menu is 240px wide (260px from `xl`). Links render through `linkComponent` / the
 * nearest `LinkProvider`, so the active state comes from you: set `active` on items (from your
 * router) or pass `value`. Do NOT use it for the app-wide primary navigation (use `IconRail`), for
 * in-content view switches (use `Tabs`) or for action lists (use `DropdownMenu`).
 */
export function InnerMenu({
  groups,
  title,
  header,
  footer,
  label,
  value,
  onValueChange,
  mobileTabs = true,
  linkComponent,
  externalLabel = '(opens in a new tab)',
  className,
}: InnerMenuProps) {
  const Link = useLinkComponent(linkComponent)
  const name = label ?? (typeof title === 'string' ? title : 'Section')
  const all = groups.flatMap((group) => group.items)

  const choose: ChooseHandler = (item, event) => {
    item.onSelect?.()
    // External links and new-tab clicks leave the current section as it is.
    if (item.external || (item.href != null && opensElsewhere(event))) return
    onValueChange?.(item.id)
  }

  return (
    <>
      <aside
        data-slot="inner-menu"
        className={cn(
          'w-[240px] shrink-0 flex-col border-r bg-background xl:w-[260px]',
          mobileTabs ? 'hidden md:flex' : 'flex',
          className,
        )}
      >
        {title != null && (
          <div className="flex h-12 shrink-0 items-center border-b px-6">
            <h2 className="truncate text-[15px] font-medium text-foreground">{title}</h2>
          </div>
        )}
        {header != null && (
          <div data-slot="inner-menu-header" className="shrink-0 border-b px-3 py-3">
            {header}
          </div>
        )}
        <nav aria-label={name} className="relative flex min-h-0 flex-1 flex-col overflow-y-auto">
          {groups.map((group) => (
            <div
              key={group.id}
              data-slot="inner-menu-group"
              className="flex flex-col gap-0.5 border-b px-3 py-4 last:border-b-0"
            >
              {group.label && (
                <MonoLabel as="h3" className="mb-1.5 px-3">
                  {group.label}
                </MonoLabel>
              )}
              <ul className="flex flex-col gap-0.5">
                {group.items.map((item) => (
                  <li key={item.id}>
                    <InnerMenuRow
                      item={item}
                      active={isItemActive(item, value)}
                      Link={Link}
                      externalLabel={externalLabel}
                      onChoose={choose}
                    />
                  </li>
                ))}
              </ul>
            </div>
          ))}
          {footer != null && <div className="mt-auto px-3 py-4">{footer}</div>}
        </nav>
      </aside>

      {mobileTabs && (
        <InnerMenuTabStrip
          items={all}
          label={name}
          value={value}
          Link={Link}
          externalLabel={externalLabel}
          onChoose={choose}
        />
      )}
    </>
  )
}
