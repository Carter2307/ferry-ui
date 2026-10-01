import * as React from 'react'
import { ArrowUpRight, Loader2 } from 'lucide-react'

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from '../primitives/command'
import { useCommandShortcut } from '../../hooks/use-command-shortcut'
import { useLinkComponent, type LinkComponent } from '../../lib/link'

import type { NavGroup, NavItem } from './types'

/* -------------------------------------------------------------------------------------------------
 * Types
 * -----------------------------------------------------------------------------------------------*/

/**
 * One command of a {@link CommandMenu}. Extends the shared `NavItem`, so the groups you give the
 * primary navigation can be passed as-is. Give it an `href` to navigate (through the link
 * component) and/or an `onSelect` to run an action. `active` is ignored here.
 */
export interface CommandMenuItem extends NavItem {
  /** Muted, right-aligned secondary text (a type, a count, a short description). */
  hint?: React.ReactNode
  /** Keyboard hint shown on the right (e.g. `"⌘N"`). Display only: bind the key yourself. */
  shortcut?: React.ReactNode
  /** Extra search terms (synonyms, ids) matched in addition to the label. */
  keywords?: string[]
  /**
   * Text the query is matched against. Defaults to `label`. Must be unique across the menu: set
   * it when two items share a label (e.g. `"Settings · Billing"`).
   */
  value?: string
  /** Keep the menu open after this item runs (toggles, multi-step commands). Default `false`. */
  keepOpen?: boolean
}

/** A titled section of a {@link CommandMenu}. Compatible with the shared `NavGroup`. */
export interface CommandMenuGroup extends Omit<NavGroup, 'items'> {
  /** Commands of the section, in display order. Empty groups are not rendered. */
  items: CommandMenuItem[]
}

/** Props of {@link CommandMenu}. */
export interface CommandMenuProps {
  /**
   * Sections of commands, separated by hairlines while idle. `label` renders as the mono group
   * heading. Put navigation first and side-effect actions last, so that opening the menu and
   * pressing Enter runs something harmless; while searching, groups are ranked by best match.
   */
  groups: CommandMenuGroup[]
  /** Controlled open state. Pair with `onOpenChange` (and `useCommandShortcut` to toggle it). */
  open?: boolean
  /** Initial open state when uncontrolled. Defaults to `false`. */
  defaultOpen?: boolean
  /**
   * Lets the menu bind its own global shortcut and toggle itself: `true` for ⌘K (Apple) / Ctrl+K
   * (elsewhere), or another letter (`"j"` for ⌘J). Works controlled (it calls `onOpenChange`) and
   * uncontrolled. Leave it at `false` (the default) when you toggle the menu yourself with
   * `useCommandShortcut` or `AppShell`'s `onCommandShortcut`, or each press would toggle twice.
   */
  shortcut?: boolean | string
  /** Called when the menu opens or closes (Escape, outside click, after running a command). */
  onOpenChange?: (open: boolean) => void
  /** Placeholder of the search field. Defaults to `"Type a command or search…"`. */
  placeholder?: string
  /** Accessible dialog title (visually hidden). Defaults to `"Command menu"`. */
  title?: string
  /** Accessible dialog description (visually hidden). Defaults to `"Search for a page or run a command"`. */
  description?: string
  /** Shown when no command matches the query. Defaults to `"No results found."`. */
  emptyMessage?: React.ReactNode
  /**
   * Shows a loading row above the groups and hides the empty message, e.g. while remote results
   * for the current query are fetched.
   */
  loading?: boolean
  /** Text of the loading row. Defaults to `"Loading…"`. */
  loadingMessage?: React.ReactNode
  /**
   * Called when the query changes (and with `""` each time the menu opens, since every opening
   * starts from an empty query). Use it to fetch remote results.
   */
  onSearchChange?: (query: string) => void
  /**
   * Set `false` when you filter yourself (e.g. server-side search): every item you pass is shown
   * as-is. Defaults to `true` (fuzzy matching on `value` / `label` and `keywords`).
   */
  shouldFilter?: boolean
  /** Called after any command runs (after its own `onSelect`), e.g. for analytics. */
  onItemSelect?: (item: CommandMenuItem) => void
  /**
   * Router-aware link used for `href` items. Defaults to the nearest `LinkProvider` (a plain `<a>`).
   * Not used for `external` items (they render a plain `<a target="_blank">`).
   */
  linkComponent?: LinkComponent
  /** Accessible name of the close (X) button. Defaults to `"Close"`; pass a translation in localized apps. */
  closeLabel?: string
  /**
   * Screen-reader text appended to the name of `external` items. Defaults to
   * `"(opens in a new tab)"`; pass a translation in localized apps.
   */
  externalLabel?: string
  /**
   * Extra content appended inside the list, after the groups: `CommandGroup` / `CommandItem` /
   * `CommandSeparator` from the Command primitive, for rows `groups` cannot express (custom row
   * markup). They are filtered like the other rows, but their `onSelect` does not close the menu:
   * call `onOpenChange(false)` yourself.
   */
  children?: React.ReactNode
  /** Extra classes for the dialog panel (e.g. to change its width). */
  className?: string
}

/* -------------------------------------------------------------------------------------------------
 * CommandMenu
 * -----------------------------------------------------------------------------------------------*/

interface RowProps {
  item: CommandMenuItem
  Link: LinkComponent
  externalLabel: string
  onRun: (item: CommandMenuItem) => void
}

/**
 * One command row. `href` items hold a real link (router adapter or `<a>`), so clicks, Enter and
 * middle-clicks all navigate the way the app's other links do: a keyboard selection is replayed as
 * a click on that link.
 */
function CommandMenuRow({ item, Link, externalLabel, onRun }: RowProps) {
  const itemRef = React.useRef<HTMLDivElement>(null)
  // Set by the link's own click handler: the click reached the link, so the router navigates.
  const linkClicked = React.useRef(false)
  // Set while a keyboard / padding selection is replayed as a click on the link.
  const replaying = React.useRef(false)

  const trailing =
    item.hint != null || item.shortcut != null || item.external ? (
      <span className="ml-auto flex min-w-0 items-center gap-2 pl-2">
        {item.hint != null && <span className="truncate text-[12px] text-foreground-lighter">{item.hint}</span>}
        {item.shortcut != null && <CommandShortcut className="shrink-0">{item.shortcut}</CommandShortcut>}
        {item.external && <ArrowUpRight className="size-3.5 shrink-0 text-foreground-lighter" aria-hidden="true" />}
      </span>
    ) : null

  const content = (
    <>
      {item.icon}
      <span className="truncate">{item.label}</span>
      {item.badge}
      {trailing}
      {item.external && <span className="sr-only">{` ${externalLabel}`}</span>}
    </>
  )

  const linkable = item.href != null && !item.disabled
  const linkClassName = 'flex min-w-0 flex-1 items-center gap-2 outline-none'
  const markLinkClicked = () => {
    linkClicked.current = true
  }
  const onSelect = () => {
    if (linkable && !linkClicked.current && !replaying.current) {
      const link = itemRef.current?.querySelector<HTMLElement>('[data-slot="command-menu-link"]')
      if (link) {
        // Keyboard selection or a click on the row padding: replay it on the link so the router
        // (or the browser) navigates. The click bubbles back to this item, which runs the command
        // once; `replaying` also stops the loop if an adapter drops `onClick`.
        replaying.current = true
        try {
          link.click()
        } finally {
          replaying.current = false
        }
        return
      }
    }
    linkClicked.current = false
    onRun(item)
  }

  return (
    <CommandItem
      ref={itemRef}
      value={item.value ?? item.label}
      keywords={item.keywords}
      disabled={item.disabled}
      onSelect={onSelect}
    >
      {linkable ? (
        item.external ? (
          // External destinations skip the router adapter: a plain anchor that opens a new tab.
          <a
            data-slot="command-menu-link"
            href={item.href as string}
            tabIndex={-1}
            target="_blank"
            rel="noreferrer"
            onClick={markLinkClicked}
            className={linkClassName}
          >
            {content}
          </a>
        ) : (
          <Link
            data-slot="command-menu-link"
            href={item.href as string}
            tabIndex={-1}
            onClick={markLinkClicked}
            className={linkClassName}
          >
            {content}
          </Link>
        )
      ) : (
        content
      )}
    </CommandItem>
  )
}

/**
 * The app-wide ⌘K command palette: a search field over grouped commands in a dialog pinned near
 * the top of the viewport. Commands navigate (`href`, through the configured link component) or
 * run an action (`onSelect`); running one closes the menu unless it sets `keepOpen`. Each opening
 * starts from an empty query; arrows wrap around; Enter runs the highlighted command.
 *
 * Mount it once near the root, control it with `open` / `onOpenChange` and toggle it with
 * `useCommandShortcut` (or let it bind ⌘K itself with `shortcut`). Use `loading` +
 * `onSearchChange` (and `shouldFilter={false}` if you filter server-side) for remote results.
 * Do NOT use it for a searchable form field or an inline picker (use `Command` inside a
 * `Popover`) or for a short action menu (use `DropdownMenu`).
 */
export function CommandMenu({
  groups,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  shortcut = false,
  placeholder = 'Type a command or search…',
  title = 'Command menu',
  description = 'Search for a page or run a command',
  emptyMessage = 'No results found.',
  loading = false,
  loadingMessage = 'Loading…',
  onSearchChange,
  shouldFilter = true,
  onItemSelect,
  linkComponent,
  closeLabel,
  externalLabel = '(opens in a new tab)',
  children,
  className,
}: CommandMenuProps) {
  const Link = useLinkComponent(linkComponent)
  const [openState, setOpenState] = React.useState(defaultOpen)
  const open = openProp ?? openState
  const setOpen = (next: boolean) => {
    if (openProp === undefined) setOpenState(next)
    onOpenChange?.(next)
  }

  useCommandShortcut(() => setOpen(!open), {
    key: typeof shortcut === 'string' ? shortcut : 'k',
    enabled: shortcut !== false && shortcut !== '',
  })

  // Every opening starts from an empty query.
  const [search, setSearch] = React.useState('')
  const [wasOpen, setWasOpen] = React.useState(open)
  if (open !== wasOpen) {
    setWasOpen(open)
    if (open) setSearch('')
  }
  const searchListener = React.useRef(onSearchChange)
  React.useEffect(() => {
    searchListener.current = onSearchChange
  })
  React.useEffect(() => {
    if (open) searchListener.current?.('')
  }, [open])

  const changeSearch = (query: string) => {
    setSearch(query)
    onSearchChange?.(query)
  }

  const run = (item: CommandMenuItem) => {
    if (!item.keepOpen) setOpen(false)
    item.onSelect?.()
    onItemSelect?.(item)
  }

  const visible = groups.filter((group) => group.items.length > 0)

  return (
    <CommandDialog
      open={open}
      onOpenChange={setOpen}
      title={title}
      description={description}
      className={className}
      closeLabel={closeLabel}
      data-slot="command-menu"
      commandProps={{ label: title, shouldFilter }}
    >
      <CommandInput placeholder={placeholder} value={search} onValueChange={changeSearch} />
      {/* Outside the listbox (only options and groups belong there), right above the results. */}
      {loading && (
        <div
          data-slot="command-menu-loading"
          role="status"
          className="flex items-center gap-2 px-4 pt-2.5 pb-1.5 text-[13px] text-foreground-light"
        >
          <Loader2 className="size-4 animate-spin text-foreground-lighter" aria-hidden="true" />
          {loadingMessage}
        </div>
      )}
      <CommandList aria-busy={loading || undefined}>
        {!loading && <CommandEmpty>{emptyMessage}</CommandEmpty>}
        {visible.map((group, index) => (
          <React.Fragment key={group.id}>
            {index > 0 && <CommandSeparator />}
            <CommandGroup heading={group.label}>
              {group.items.map((item) => (
                <CommandMenuRow key={item.id} item={item} Link={Link} externalLabel={externalLabel} onRun={run} />
              ))}
            </CommandGroup>
          </React.Fragment>
        ))}
        {children}
      </CommandList>
    </CommandDialog>
  )
}
