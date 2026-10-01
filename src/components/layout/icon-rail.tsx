import * as React from 'react'
import { ExternalLink, PanelLeftClose, PanelLeftOpen } from 'lucide-react'

import { MonoLabel } from '../patterns/mono-label'
import { Tooltip, TooltipContent, TooltipTrigger } from '../primitives/tooltip'
import { useLinkComponent, type LinkComponent, type LinkComponentProps } from '../../lib/link'
import { cn } from '../../lib/utils'

import type { NavGroup, NavItem } from './types'

/* -------------------------------------------------------------------------------------------------
 * Context
 * -----------------------------------------------------------------------------------------------*/

/** State an {@link IconRail} shares with the content of its slots. */
export interface IconRailContextValue {
  /** `true` while the rail shows labels (200px), `false` while it shows icons only (56px). */
  expanded: boolean
  /** Expands or collapses the rail. */
  setExpanded: (expanded: boolean) => void
}

const IconRailContext = React.createContext<IconRailContextValue | null>(null)

/** What a rail hands down to its rows: the items of its lists and the `IconRailItem`s of its slots. */
interface RailItemContextValue {
  linkComponent?: LinkComponent
  externalLabel?: string
}

const RailItemContext = React.createContext<RailItemContextValue>({})

const DEFAULT_EXTERNAL_LABEL = '(opens in a new tab)'

/**
 * Reads the nearest {@link IconRail}'s expanded state. Use it inside the `logo` / `footer` slots to
 * adapt custom content (show a wordmark only when expanded). Returns `null` outside a rail.
 * For pure styling, the rail also exposes `data-expanded` and the `group/icon-rail` class
 * (e.g. `group-data-[expanded=false]/icon-rail:sr-only`).
 */
export function useIconRail(): IconRailContextValue | null {
  return React.useContext(IconRailContext)
}

/* -------------------------------------------------------------------------------------------------
 * IconRailItem
 * -----------------------------------------------------------------------------------------------*/

const itemClassName = cn(
  'relative flex h-9 w-full cursor-pointer items-center gap-3 rounded-md px-[9px] text-left text-sm outline-none transition-colors',
  'focus-visible:ring-2 focus-visible:ring-ring',
  'disabled:pointer-events-none disabled:opacity-50',
)
const idleClassName = 'text-foreground-lighter hover:bg-surface-200 hover:text-foreground'
const activeClassName = 'bg-selection text-foreground'
const iconClassName =
  'flex size-[18px] shrink-0 items-center justify-center [&_svg]:shrink-0 [&_svg]:[stroke-width:1.6] [&_svg:not([class*=size-])]:size-[18px]'

type ItemElementProps = React.HTMLAttributes<HTMLElement> & {
  item: NavItem
  expanded: boolean
  Link: LinkComponent
  externalLabel: string
  ref?: React.Ref<HTMLElement>
}

/**
 * The clickable row: a router link when the item has an `href` (a plain new-tab `<a>` when it is
 * `external`), else a button. Forwards the tooltip trigger props.
 */
function ItemElement({ item, expanded, Link, externalLabel, onClick, className, ref, ...props }: ItemElementProps) {
  const content = (
    <>
      <span aria-hidden="true" className={iconClassName}>
        {item.icon}
      </span>
      <span className={cn('min-w-0 flex-1 truncate', !expanded && 'sr-only')}>{item.label}</span>
      {item.badge != null &&
        (expanded ? (
          <span className="ml-auto flex shrink-0 items-center">{item.badge}</span>
        ) : (
          <>
            <span className="sr-only">{item.badge}</span>
            <span
              aria-hidden="true"
              className="absolute top-[7px] left-[25px] size-1.5 rounded-full bg-primary ring-2 ring-background"
            />
          </>
        ))}
      {item.external && (
        <>
          {expanded && <ExternalLink aria-hidden="true" className="ml-auto size-3.5 shrink-0 text-foreground-muted" />}
          <span className="sr-only">{` ${externalLabel}`}</span>
        </>
      )}
    </>
  )

  const shared = {
    'data-slot': 'icon-rail-item',
    'data-active': item.active ? 'true' : undefined,
    className: cn(itemClassName, item.active ? activeClassName : idleClassName, className),
    onClick: (event: React.MouseEvent<HTMLElement>) => {
      onClick?.(event)
      item.onSelect?.()
    },
  }

  if (item.href && !item.disabled) {
    const linkProps = {
      ...props,
      ...shared,
      ref,
      href: item.href,
      'aria-current': item.active ? 'page' : undefined,
    } as LinkComponentProps
    // External destinations skip the router adapter: a plain anchor that opens a new tab.
    if (item.external) {
      return (
        <a target="_blank" rel="noreferrer" {...linkProps}>
          {content}
        </a>
      )
    }
    return <Link {...linkProps}>{content}</Link>
  }

  return (
    <button
      type="button"
      {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}
      {...shared}
      ref={ref as React.Ref<HTMLButtonElement>}
      disabled={item.disabled}
      aria-current={item.active ? 'page' : undefined}
    >
      {content}
    </button>
  )
}

/** Props of {@link IconRailItem}. */
export interface IconRailItemProps {
  /** The destination or action to render (label, icon, href / onSelect, active, badge…). */
  item: NavItem
  /**
   * Router-aware link for this item. Defaults to the rail's `linkComponent`, then the nearest
   * `LinkProvider`. Not used for `external` items (they render a plain `<a target="_blank">`).
   */
  linkComponent?: LinkComponent
  /** Extra classes for the row. */
  className?: string
}

/**
 * One row of an {@link IconRail}: an 18px line icon, then the label when the rail is expanded.
 * While collapsed, the label becomes a tooltip on the right and stays the accessible name; a badge
 * becomes a small dot. The row is a link (through the configured link component) when the item has
 * an `href`, otherwise a button calling `onSelect`. An `external` item is a plain `<a>` that opens a
 * new tab, with the rail's `labels.external` text for screen readers.
 *
 * The rail renders its `items` / `groups` with it; use it yourself only in the rail's `footer` slot
 * (help, docs, settings shortcuts) so those rows match. Do NOT use it outside an `IconRail`.
 */
export function IconRailItem({ item, linkComponent, className }: IconRailItemProps) {
  const rail = useIconRail()
  const railItem = React.useContext(RailItemContext)
  const Link = useLinkComponent(linkComponent ?? railItem.linkComponent)
  const externalLabel = railItem.externalLabel ?? DEFAULT_EXTERNAL_LABEL
  const expanded = rail?.expanded ?? false

  if (expanded) {
    return <ItemElement item={item} expanded Link={Link} externalLabel={externalLabel} className={className} />
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <ItemElement item={item} expanded={false} Link={Link} externalLabel={externalLabel} className={className} />
      </TooltipTrigger>
      <TooltipContent side="right">
        <span className="flex items-center gap-2">
          {item.label}
          {item.badge}
        </span>
      </TooltipContent>
    </Tooltip>
  )
}

/* -------------------------------------------------------------------------------------------------
 * IconRail
 * -----------------------------------------------------------------------------------------------*/

/** Built-in texts of an {@link IconRail}: its expand / collapse toggle and its external items (override them to translate). */
export interface IconRailLabels {
  /** Accessible name and tooltip of the toggle while collapsed. Defaults to `"Expand menu"`. */
  expand?: string
  /** Accessible name and tooltip of the toggle while expanded. Defaults to `"Collapse menu"`. */
  collapse?: string
  /** Visible text next to the toggle icon while expanded. Defaults to `"Collapse"`. */
  collapseText?: string
  /**
   * Screen-reader text appended to the name of `external` items (list rows and `IconRailItem`s in
   * the slots). Defaults to `"(opens in a new tab)"`.
   */
  external?: string
}

/** Props of {@link IconRail}. */
export interface IconRailProps extends Omit<React.ComponentProps<'nav'>, 'children'> {
  /**
   * Navigation groups, separated by thin dividers. A group `label` shows as a mono heading while
   * expanded (and names the list for screen readers). Takes precedence over `items`.
   */
  groups?: NavGroup[]
  /** Shorthand for a single group of items (no dividers). Ignored when `groups` is set. */
  items?: NavItem[]
  /** Controlled expanded state (labels visible, 200px wide). Pair with `onExpandedChange`. */
  expanded?: boolean
  /** Initial expanded state when uncontrolled. Defaults to `false` (56px, icons only). */
  defaultExpanded?: boolean
  /** Called when the toggle expands or collapses the rail. Persist the value yourself if needed. */
  onExpandedChange?: (expanded: boolean) => void
  /** Shows the expand / collapse toggle at the bottom. Defaults to `true`. */
  collapsible?: boolean
  /**
   * Top slot, above the items (brand mark, workspace switcher). It is 40px wide while collapsed:
   * render a square mark, and use `useIconRail()` to show more when expanded.
   */
  logo?: React.ReactNode
  /**
   * Bottom slot, pinned above the toggle: secondary rows (help, docs, settings) as
   * `IconRailItem`s, or an account avatar.
   */
  footer?: React.ReactNode
  /** Router-aware link used by every row. Defaults to the nearest `LinkProvider` component, else a plain `<a>`. */
  linkComponent?: LinkComponent
  /** Built-in texts: the expand / collapse toggle and the screen-reader suffix of external items. */
  labels?: IconRailLabels
  /** Accessible name of the `<nav>` landmark. Defaults to `"Main"`; change it when a page has several navs. */
  'aria-label'?: string
}

/**
 * Vertical icon navigation for the left edge of an app: 56px wide with 18px line icons (labels in
 * tooltips), expandable to 200px with labels. The active item sits on the selection fill; groups
 * are separated by short dividers; a toggle at the bottom expands or collapses it.
 *
 * Use it as the `rail` of an `AppShell` for 3–10 top-level destinations with recognizable icons.
 * Mark the current destination with `active: true` on its item. Links render through the
 * configured link component (see `LinkProvider`), except `external` items, which are plain
 * `<a target="_blank">` anchors. The expanded state is controlled
 * (`expanded` + `onExpandedChange`) or uncontrolled (`defaultExpanded`); persist it yourself.
 * Collapsed labels are Radix tooltips, so a `TooltipProvider` must be mounted above it (once, at
 * the app root). Do NOT use it on phones (it is desktop-only in `AppShell`; use `MobileNav`), for
 * deep or secondary navigation inside a section (use an inner menu or tabs), or for items without
 * icons.
 */
export function IconRail({
  groups,
  items,
  expanded: expandedProp,
  defaultExpanded = false,
  onExpandedChange,
  collapsible = true,
  logo,
  footer,
  linkComponent,
  labels,
  className,
  'aria-label': ariaLabel = 'Main',
  ...props
}: IconRailProps) {
  const [uncontrolled, setUncontrolled] = React.useState(defaultExpanded)
  const expanded = expandedProp ?? uncontrolled
  const isControlled = expandedProp !== undefined
  const setExpanded = React.useCallback(
    (next: boolean) => {
      if (!isControlled) setUncontrolled(next)
      onExpandedChange?.(next)
    },
    [isControlled, onExpandedChange],
  )
  const context = React.useMemo(() => ({ expanded, setExpanded }), [expanded, setExpanded])
  const externalLabel = labels?.external
  const itemContext = React.useMemo(() => ({ linkComponent, externalLabel }), [linkComponent, externalLabel])
  const baseId = React.useId()

  const resolvedGroups: NavGroup[] = groups ?? (items ? [{ id: 'items', items }] : [])
  const expandLabel = labels?.expand ?? 'Expand menu'
  const collapseLabel = labels?.collapse ?? 'Collapse menu'
  const toggleLabel = expanded ? collapseLabel : expandLabel

  return (
    <IconRailContext.Provider value={context}>
      <RailItemContext.Provider value={itemContext}>
        <nav
          data-slot="icon-rail"
          data-expanded={expanded}
          aria-label={ariaLabel}
          className={cn(
            'group/icon-rail flex h-full shrink-0 flex-col border-r bg-background py-2 transition-[width] duration-200 ease-out motion-reduce:transition-none',
            expanded ? 'w-[200px]' : 'w-14',
            className,
          )}
          {...props}
        >
          {logo != null && (
            <div data-slot="icon-rail-logo" className="mb-2 flex min-h-9 shrink-0 items-center px-2">
              {logo}
            </div>
          )}
          <ul className="-my-0.5 flex min-h-0 flex-1 flex-col gap-0.5 overflow-x-hidden overflow-y-auto px-2 py-0.5 scrollbar-none">
            {resolvedGroups.map((group, gi) => {
              const headingId = group.label ? `${baseId}-${group.id}` : undefined
              return (
                <li key={group.id} className="flex flex-col gap-0.5">
                  {gi > 0 && (
                    <div
                      aria-hidden="true"
                      className={cn('my-1.5 h-px shrink-0 bg-border-strong', expanded ? 'mx-2' : 'mx-auto w-6')}
                    />
                  )}
                  {group.label && (
                    <MonoLabel
                      as="div"
                      id={headingId}
                      className={cn('truncate px-[9px] pt-1 pb-0.5', !expanded && 'sr-only')}
                    >
                      {group.label}
                    </MonoLabel>
                  )}
                  <ul className="flex flex-col gap-0.5" aria-labelledby={headingId}>
                    {group.items.map((item) => (
                      <li key={item.id}>
                        <IconRailItem item={item} />
                      </li>
                    ))}
                  </ul>
                </li>
              )
            })}
          </ul>
          {footer != null && (
            <div data-slot="icon-rail-footer" className="flex shrink-0 flex-col gap-0.5 px-2 pt-2">
              {footer}
            </div>
          )}
          {collapsible && (
            <div className="shrink-0 px-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    data-slot="icon-rail-toggle"
                    onClick={() => setExpanded(!expanded)}
                    aria-label={toggleLabel}
                    aria-expanded={expanded}
                    className="flex h-9 w-full cursor-pointer items-center gap-3 rounded-md px-[9px] text-sm text-foreground-lighter transition-colors outline-none hover:bg-surface-200 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {expanded ? (
                      <PanelLeftClose className="size-[18px] shrink-0" strokeWidth={1.6} aria-hidden="true" />
                    ) : (
                      <PanelLeftOpen className="size-[18px] shrink-0" strokeWidth={1.6} aria-hidden="true" />
                    )}
                    <span className={cn('truncate', !expanded && 'sr-only')}>{labels?.collapseText ?? 'Collapse'}</span>
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right">{toggleLabel}</TooltipContent>
              </Tooltip>
            </div>
          )}
        </nav>
      </RailItemContext.Provider>
    </IconRailContext.Provider>
  )
}
