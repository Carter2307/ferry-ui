import * as React from 'react'
import { Check } from 'lucide-react'

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '../primitives/command'
import { Popover, PopoverContent, PopoverTrigger } from '../primitives/popover'
import { useLinkComponent, type LinkComponent } from '../../lib/link'
import { cn } from '../../lib/utils'
import { TopBarSegment } from './top-bar'

/** One entity the user can switch to (a project, workspace, team, repository…). */
export interface ResourceSwitcherItem {
  /** Stable id; compared with the switcher's `value` to mark the current item. */
  id: string
  /** Name shown in the list and, for the current item, in the trigger. */
  label: string
  /** 16px leading icon (muted), e.g. the entity's type or avatar. */
  icon?: React.ReactNode
  /** Secondary line under the label (owner, plan, member count…); truncated. */
  description?: React.ReactNode
  /** Right-aligned adornment before the check mark (status dot, count, shortcut). */
  meta?: React.ReactNode
  /**
   * Destination. The row is rendered as a real link (through the link
   * component), so click, Enter and "open in new tab" all work.
   */
  href?: string
  /** Extra search terms matched by the filter besides the label and id. */
  keywords?: string[]
  /** Visible but not selectable. */
  disabled?: boolean
}

/**
 * A footer command under the list ("All projects", "New project…"). Actions are
 * never filtered out by the search, so they stay one keystroke away.
 */
export interface ResourceSwitcherAction {
  /** Stable key (also used as the command's internal search value). */
  id: string
  /** Visible text of the command. */
  label: string
  /** 16px leading icon. */
  icon?: React.ReactNode
  /** Destination, rendered as a real link through the link component. */
  href?: string
  /** Called when the action is chosen (the popover closes first). Use it for in-place actions such as opening a "New project" dialog. */
  onSelect?: () => void
  /** Visible but not selectable. */
  disabled?: boolean
}

/** Props for {@link ResourceSwitcher}. */
export interface ResourceSwitcherProps {
  /** Entities to switch between. */
  items: ResourceSwitcherItem[]
  /** Id of the current item (controlled). Marked with a check and shown in the trigger. */
  value?: string
  /** Initial current item when uncontrolled (the switcher then tracks selections itself). */
  defaultValue?: string
  /**
   * Called when an item is chosen, with its id and the item. For `href` items
   * navigation happens through the link; use this for in-place switching or
   * to observe the choice.
   */
  onValueChange?: (value: string, item: ResourceSwitcherItem) => void
  /** Footer commands, shown under a separator and never filtered out by the search. */
  actions?: ResourceSwitcherAction[]
  /** Optional mono uppercase heading above the items ("Projects"). */
  heading?: React.ReactNode
  /** Placeholder of the search field (default "Find…"). */
  searchPlaceholder?: string
  /** Trigger text when no item is current (default "Select…"). */
  placeholder?: string
  /**
   * Items are being fetched: the list shows `loadingMessage` instead of `emptyMessage`, and
   * the trigger shows a skeleton while the current item is not in `items` yet (unless
   * `children` is given).
   */
  loading?: boolean
  /** Dims the trigger and prevents opening (e.g. while the user cannot switch). */
  disabled?: boolean
  /** Message when nothing matches (default "Nothing found."). */
  emptyMessage?: React.ReactNode
  /** Message while loading with no match yet (default "Loading…"). */
  loadingMessage?: React.ReactNode
  /** @deprecated Renamed to `emptyMessage` (same name as in `CommandMenu`); `emptyMessage` wins when both are set. */
  emptyText?: React.ReactNode
  /** @deprecated Renamed to `loadingMessage` (same name as in `CommandMenu`); `loadingMessage` wins when both are set. */
  loadingText?: React.ReactNode
  /**
   * Set `false` to filter yourself (server-side search) from `onSearchChange`. The
   * trigger reads the current item from `items`: when your results may not contain
   * it, pass the trigger text as `children` (and `icon`).
   */
  shouldFilter?: boolean
  /** Called with the search query as the user types (and with "" when the popover reopens). */
  onSearchChange?: (query: string) => void
  /**
   * What the trigger does, e.g. "switch project". It is appended to the trigger's
   * visible text to form its accessible name ("Web app, switch project"), so
   * the current item is always announced; a label that already contains the
   * visible text ("Project Web app, switch project") is used as is. Also names
   * the popover. Without it the trigger is named by its visible text and the
   * popover "Switcher".
   */
  label?: string
  /**
   * Custom trigger text, truncated at 180px like any `TopBarSegment`. Defaults to
   * the current item's label, or `placeholder` when no item is current. Put an
   * icon, avatar or logo in `icon`, not here.
   */
  children?: React.ReactNode
  /**
   * Leading icon of the trigger. Defaults to the current item's icon; pass `null`
   * to show none.
   */
  icon?: React.ReactNode
  /** Controlled open state of the popover (pair with `onOpenChange`). */
  open?: boolean
  /** Initial open state when uncontrolled. */
  defaultOpen?: boolean
  /** Called with the next open state. */
  onOpenChange?: (open: boolean) => void
  /** Alignment of the popover against the trigger (default "start"). */
  align?: 'start' | 'center' | 'end'
  /** Link component override for `href` items and actions. */
  linkComponent?: LinkComponent
  /** Classes for the trigger. */
  className?: string
  /** Classes for the popover panel (default 288px wide, no padding). */
  contentClassName?: string
}

function isModifiedClick(event: React.MouseEvent) {
  return event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0
}

/**
 * Wires a cmdk row rendered as a link: a real click follows the link, while
 * Enter (which cmdk reports through `onSelect` only) clicks it programmatically.
 */
function useLinkRow(onChosen: () => void) {
  const clickedRef = React.useRef(false)
  const onClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    // Runs before cmdk's own click handler, which then calls `onSelect`.
    clickedRef.current = true
    if (!isModifiedClick(event)) onChosen()
  }
  const onSelect = (element: HTMLElement | null) => {
    if (clickedRef.current) {
      clickedRef.current = false
      return
    }
    element?.click()
    clickedRef.current = false
  }
  return { onClick, onSelect }
}

function LinkRow({
  href,
  value,
  keywords,
  disabled,
  forceMount,
  current,
  linkComponent,
  onChosen,
  children,
}: {
  href: string
  value: string
  keywords?: string[]
  disabled?: boolean
  forceMount?: boolean
  current?: boolean
  linkComponent?: LinkComponent
  onChosen: () => void
  children: React.ReactNode
}) {
  const Link = useLinkComponent(linkComponent)
  // Marker used to find the row element: cmdk reports Enter through `onSelect` without it.
  const markerRef = React.useRef<HTMLSpanElement>(null)
  const { onClick, onSelect } = useLinkRow(onChosen)
  return (
    <CommandItem
      asChild
      value={value}
      keywords={keywords}
      disabled={disabled}
      forceMount={forceMount}
      onSelect={() => onSelect(markerRef.current?.closest<HTMLElement>('[cmdk-item]') ?? null)}
    >
      {/* `Link` comes from props/context (useLinkComponent): stable, not created during render. */}
      {/* eslint-disable-next-line react-hooks/static-components */}
      <Link href={href} onClick={onClick} aria-current={current ? 'true' : undefined} tabIndex={-1}>
        <span ref={markerRef} hidden />
        {children}
      </Link>
    </CommandItem>
  )
}

/**
 * Trail segment with a ⇕ searchable popover to jump between entities of the
 * same kind (projects, workspaces, teams, repositories): a search field, the
 * list with the current item checked, and footer commands ("All projects",
 * "New project").
 *
 * Use it in a `TopBar` trail (it renders a `TopBarSegment` trigger) or any
 * compact header. Items with `href` render as links through the configured
 * link component; others call `onValueChange`. Do NOT use it for a form
 * field value (use `Select`) or for a handful of actions (use `DropdownMenu`).
 */
export function ResourceSwitcher({
  items,
  value,
  defaultValue,
  onValueChange,
  actions,
  heading,
  searchPlaceholder = 'Find…',
  placeholder = 'Select…',
  loading = false,
  disabled = false,
  emptyMessage,
  loadingMessage,
  emptyText,
  loadingText,
  shouldFilter,
  onSearchChange,
  label,
  children,
  icon,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  align = 'start',
  linkComponent,
  className,
  contentClassName,
}: ResourceSwitcherProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen)
  const open = openProp ?? uncontrolledOpen

  // The query starts empty every time the popover opens (even while the previous close animates).
  const [search, setSearch] = React.useState('')
  const [wasOpen, setWasOpen] = React.useState(open)
  if (open !== wasOpen) {
    setWasOpen(open)
    if (open) setSearch('')
  }
  const changeSearch = (query: string) => {
    setSearch(query)
    onSearchChange?.(query)
  }

  const setOpen = (next: boolean) => {
    if (openProp === undefined) setUncontrolledOpen(next)
    if (next && search) onSearchChange?.('')
    onOpenChange?.(next)
  }

  const [uncontrolledValue, setUncontrolledValue] = React.useState(defaultValue)
  const currentId = value ?? uncontrolledValue
  const current = items.find((item) => item.id === currentId)

  const choose = (item: ResourceSwitcherItem) => {
    setOpen(false)
    if (value === undefined) setUncontrolledValue(item.id)
    onValueChange?.(item.id, item)
  }

  const runAction = (action: ResourceSwitcherAction) => {
    setOpen(false)
    action.onSelect?.()
  }

  const empty = emptyMessage ?? emptyText ?? 'Nothing found.'
  const loadingContent = loadingMessage ?? loadingText ?? 'Loading…'

  // Accessible name of the trigger: the visible text first (WCAG "label in name"), then `label`.
  // The visible text is unknown while the skeleton shows or when `children` is not plain text
  // (the current item's label is then the best guess).
  const showSkeleton = loading && !current && children == null
  const triggerText =
    typeof children === 'string' || typeof children === 'number'
      ? String(children)
      : children == null
        ? showSkeleton
          ? undefined
          : (current?.label ?? placeholder)
        : current?.label
  const triggerName =
    label === undefined || !triggerText || label.toLowerCase().includes(triggerText.toLowerCase())
      ? label
      : `${triggerText}, ${label}`

  const itemContent = (item: ResourceSwitcherItem) => (
    <>
      {item.icon}
      <span className="flex min-w-0 flex-col">
        <span className="truncate">{item.label}</span>
        {item.description && (
          <span className="truncate text-[12px] text-foreground-lighter">{item.description}</span>
        )}
      </span>
      <span className="ml-auto flex shrink-0 items-center gap-2">
        {item.meta}
        <Check
          className={cn('size-3.5', item.id === currentId ? 'text-foreground' : 'invisible')}
          aria-hidden="true"
        />
      </span>
    </>
  )

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <TopBarSegment
          aria-label={triggerName}
          icon={icon !== undefined ? icon : current?.icon}
          chevron
          loading={showSkeleton}
          disabled={disabled}
          className={className}
        >
          {children ?? (current ? current.label : <span className="text-foreground-lighter">{placeholder}</span>)}
        </TopBarSegment>
      </PopoverTrigger>
      <PopoverContent
        data-slot="resource-switcher-content"
        aria-label={label ?? 'Switcher'}
        align={align}
        className={cn('w-72 p-0', contentClassName)}
      >
        <Command loop shouldFilter={shouldFilter}>
          <CommandInput placeholder={searchPlaceholder} value={search} onValueChange={changeSearch} />
          <CommandList className="max-h-80">
            <CommandEmpty>{loading ? loadingContent : empty}</CommandEmpty>
            {items.length > 0 && (
              <CommandGroup heading={heading}>
                {items.map((item) => {
                  const itemValue = `${item.label} ${item.id}`
                  const isCurrent = item.id === currentId
                  return item.href ? (
                    <LinkRow
                      key={item.id}
                      href={item.href}
                      value={itemValue}
                      keywords={item.keywords}
                      disabled={item.disabled}
                      current={isCurrent}
                      linkComponent={linkComponent}
                      onChosen={() => choose(item)}
                    >
                      {itemContent(item)}
                    </LinkRow>
                  ) : (
                    <CommandItem
                      key={item.id}
                      value={itemValue}
                      keywords={item.keywords}
                      disabled={item.disabled}
                      aria-current={isCurrent ? 'true' : undefined}
                      onSelect={() => choose(item)}
                    >
                      {itemContent(item)}
                    </CommandItem>
                  )
                })}
              </CommandGroup>
            )}
            {actions && actions.length > 0 && (
              <>
                {/* A top border rather than CommandSeparator: role="separator" is not allowed inside a listbox. */}
                <CommandGroup forceMount className={cn(items.length > 0 && 'mt-1 border-t pt-2')}>
                  {actions.map((action) =>
                    action.href ? (
                      <LinkRow
                        key={action.id}
                        href={action.href}
                        value={`__action ${action.id}`}
                        disabled={action.disabled}
                        forceMount
                        linkComponent={linkComponent}
                        onChosen={() => runAction(action)}
                      >
                        {action.icon}
                        {action.label}
                      </LinkRow>
                    ) : (
                      <CommandItem
                        key={action.id}
                        value={`__action ${action.id}`}
                        disabled={action.disabled}
                        forceMount
                        onSelect={() => runAction(action)}
                      >
                        {action.icon}
                        {action.label}
                      </CommandItem>
                    ),
                  )}
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
