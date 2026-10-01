import * as React from 'react'
import { ChevronDown, Search, X } from 'lucide-react'

import { cn } from '../../lib/utils'
import { Button, type ButtonProps } from '../primitives/button'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../primitives/dropdown-menu'
import { Input, type InputProps } from '../primitives/input'

/** Props of {@link ListToolbar}: every `<div>` prop plus `actions`. */
export interface ListToolbarProps extends React.ComponentProps<'div'> {
  /** Right-aligned controls: view toggles, export, and the list's primary "New …" action last. */
  actions?: React.ReactNode
}

/**
 * The row above a list, table or grid: search and filters on the left, actions pushed to the right,
 * wrapping onto several lines on narrow screens.
 *
 * Use it directly above the collection it controls, with a {@link SearchInput} first, then
 * {@link FilterButton}s / {@link FilterMenu}s and a sort menu as children. It has no outer margin:
 * add `mb-4` unless its parent already spaces its children (a PageSection does). Do NOT use it
 * for page-level actions unrelated to the list (put them in the PageHeader `actions`).
 */
export function ListToolbar({ actions, className, children, ...props }: ListToolbarProps) {
  return (
    <div data-slot="list-toolbar" className={cn('flex flex-wrap items-center gap-2', className)} {...props}>
      {children}
      {actions && <div className="ml-auto flex shrink-0 items-center gap-2">{actions}</div>}
    </div>
  )
}

/** Props of {@link SearchInput}: most Input props (id, name, autoFocus, disabled…) plus the ones below. */
export interface SearchInputProps
  extends Omit<InputProps, 'value' | 'defaultValue' | 'onChange' | 'type' | 'size' | 'className'> {
  /** Controlled query. Pair with `onValueChange`. */
  value?: string
  /** Initial query when uncontrolled. */
  defaultValue?: string
  /** Called on every keystroke, and with `''` when cleared (× button or Escape). Debounce upstream if it hits a server. */
  onValueChange?: (value: string) => void
  /** Placeholder, phrased as the action ("Search projects"). Default "Search". */
  placeholder?: string
  /** Accessible name. Defaults to the placeholder. */
  label?: string
  /** Accessible name of the clear (×) button, for translation. Default "Clear search". */
  clearLabel?: string
  /** Field height (default `sm` 30px, to line up with toolbar buttons). */
  size?: 'tiny' | 'sm' | 'md'
  /** Merged onto the wrapper (controls width: full width on mobile, 200–320px flexible from `sm`). */
  className?: string
  /** Merged onto the inner `<input>`. */
  inputClassName?: string
}

/**
 * Search field for list toolbars: leading magnifier icon, a clear (×) button once there is text,
 * and Escape clears the query. Filters as the user types; controlled (`value` + `onValueChange`)
 * or uncontrolled (`defaultValue`).
 *
 * Use it as the first item of a {@link ListToolbar} to filter the list below. Do NOT use it for
 * global / command search across the app (use a command palette) or as a form field.
 */
export function SearchInput({
  value,
  defaultValue = '',
  onValueChange,
  placeholder = 'Search',
  label,
  clearLabel = 'Clear search',
  size = 'sm',
  className,
  inputClassName,
  onKeyDown,
  ref: refProp,
  ...props
}: SearchInputProps) {
  const [inner, setInner] = React.useState(defaultValue)
  const current = value ?? inner
  const setValue = (next: string) => {
    if (value === undefined) setInner(next)
    onValueChange?.(next)
  }
  const ref = React.useRef<HTMLInputElement | null>(null)
  const setRefs = React.useCallback(
    (node: HTMLInputElement | null) => {
      ref.current = node
      if (typeof refProp === 'function') refProp(node)
      else if (refProp) refProp.current = node
    },
    [refProp],
  )
  return (
    <div
      data-slot="search-input"
      className={cn('relative w-full sm:w-auto sm:max-w-[320px] sm:min-w-[200px] sm:flex-1', className)}
    >
      <Search
        className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-foreground-lighter"
        aria-hidden="true"
      />
      <Input
        ref={setRefs}
        type="search"
        size={size}
        value={current}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          onKeyDown?.(e)
          if (e.defaultPrevented) return
          if (e.key === 'Escape' && current) {
            e.preventDefault()
            setValue('')
          }
        }}
        placeholder={placeholder}
        aria-label={label ?? placeholder}
        autoComplete="off"
        spellCheck={false}
        className={cn('pr-8 pl-8 [&::-webkit-search-cancel-button]:hidden', inputClassName)}
        {...props}
      />
      {current && !props.disabled && (
        <button
          type="button"
          onClick={() => {
            setValue('')
            ref.current?.focus()
          }}
          className="absolute top-1/2 right-1.5 flex size-5 -translate-y-1/2 items-center justify-center rounded-sm text-foreground-lighter outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
          aria-label={clearLabel}
        >
          <X className="size-3.5" />
        </button>
      )}
    </div>
  )
}

/** Props of {@link FilterButton}: every Button prop except `children` / `variant`, plus the ones below. */
export interface FilterButtonProps extends Omit<ButtonProps, 'children' | 'variant'> {
  /** Name of the filtered dimension ("Status", "Owner", "Plan"). */
  label: string
  /** Labels of the currently selected values: drives the count badge, tooltip and accessible name. */
  selected?: string[]
  /**
   * Builds the accessible name from `label` and the `selected` labels, for translation. Default
   * (English): "Filter by status" when nothing is selected, "Status filter: Paid, Overdue" otherwise.
   * An explicit `aria-label` wins over it.
   */
  triggerLabel?: (label: string, selected: string[]) => string
}

/** Default (English) accessible name of a {@link FilterButton}. */
const defaultTriggerLabel = (label: string, selected: string[]) =>
  selected.length > 0 ? `${label} filter: ${selected.join(', ')}` : `Filter by ${label.toLowerCase()}`

/**
 * Dashed toolbar button for one filter dimension (`Status ⌄`): label, a count badge of selected
 * values and a chevron; it turns solid while the filter is active. Accessible name: "Filter by
 * status", or "Status filter: Paid, Overdue" when active (reword or translate it with `triggerLabel`).
 *
 * Use it as the `asChild` child of a PopoverTrigger / DropdownMenuTrigger when you build a custom
 * filter panel; for a plain multi-select list use {@link FilterMenu}, which wires it for you. Do NOT
 * use it for sorting or view options (use a regular Button with a menu).
 */
export function FilterButton({
  label,
  selected = [],
  triggerLabel = defaultTriggerLabel,
  className,
  ...props
}: FilterButtonProps) {
  const summary = selected.join(', ')
  return (
    <Button
      data-slot="filter-button"
      data-active={selected.length > 0 || undefined}
      variant="dashed"
      iconRight={<ChevronDown className="size-3.5 opacity-70" />}
      aria-label={triggerLabel(label, selected)}
      title={summary || undefined}
      className={cn(selected.length > 0 && 'border-solid border-border-strong text-foreground', className)}
      {...props}
    >
      {label}
      {selected.length > 0 && (
        <span
          aria-hidden="true"
          className="inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-primary-soft px-1 font-mono text-[10.5px] text-primary tabular"
        >
          {selected.length}
        </span>
      )}
    </Button>
  )
}

/** One option of a {@link FilterMenu}. */
export interface FilterOption {
  /** Stable value stored in the selection. */
  value: string
  /** Text shown in the menu and in the trigger's summary. */
  label: string
  /** Number of matching items, shown right-aligned in mono (optional). */
  count?: number
  /** Small leading visual (a status dot, an avatar, a 16px icon). */
  icon?: React.ReactNode
  /** Makes the option unselectable. */
  disabled?: boolean
}

/** Props of {@link FilterMenu}. */
export interface FilterMenuProps {
  /** Name of the filtered dimension, shown on the trigger ("Status"). */
  label: string
  /** The selectable values, in display order. */
  options: FilterOption[]
  /** Controlled selection (option values). Pair with `onValueChange`. */
  value?: string[]
  /** Initial selection when uncontrolled. */
  defaultValue?: string[]
  /** Called with the new selection (in `options` order) on every toggle and on "Clear filter". */
  onValueChange?: (value: string[]) => void
  /** Mono heading at the top of the menu. Default `Filter by <label>` (the lower-cased `label`). Pass `null` to hide it. */
  heading?: React.ReactNode
  /** Text of the reset item shown while something is selected (default "Clear filter"). */
  clearLabel?: React.ReactNode
  /**
   * Builds the accessible name of the trigger from `label` and the labels of the selected options, for
   * translation. Default (English): "Filter by status", or "Status filter: Paid, Overdue" when active.
   */
  triggerLabel?: (label: string, selected: string[]) => string
  /** Controlled open state of the menu. */
  open?: boolean
  /** Initial open state when uncontrolled. */
  defaultOpen?: boolean
  /** Called when the menu opens or closes. */
  onOpenChange?: (open: boolean) => void
  /** Menu alignment against the trigger (default `start`). */
  align?: 'start' | 'center' | 'end'
  /** Disables the trigger. */
  disabled?: boolean
  /** Merged onto the trigger button. */
  className?: string
  /** Merged onto the menu panel (default width 192px). */
  contentClassName?: string
}

/**
 * Multi-select filter for list toolbars: a {@link FilterButton} that opens a menu of checkbox
 * options (with optional icons and counts) and a "Clear filter" item. The menu stays open while
 * toggling so several values can be picked. Controlled (`value` + `onValueChange`) or uncontrolled.
 *
 * Use it for categorical filters with up to ~10 known values (status, type, plan, owner). An empty
 * selection means "no filter". Do NOT use it for long or searchable lists (build a Popover with a
 * Command list around a FilterButton) or for single-choice sorting (use a radio menu).
 */
export function FilterMenu({
  label,
  options,
  value,
  defaultValue = [],
  onValueChange,
  heading,
  clearLabel = 'Clear filter',
  triggerLabel,
  open,
  defaultOpen,
  onOpenChange,
  align = 'start',
  disabled,
  className,
  contentClassName,
}: FilterMenuProps) {
  const [inner, setInner] = React.useState<string[]>(defaultValue)
  const selected = value ?? inner
  const setSelected = (next: string[]) => {
    if (value === undefined) setInner(next)
    onValueChange?.(next)
  }
  const toggle = (optionValue: string, on: boolean) =>
    setSelected(options.map((o) => o.value).filter((v) => (v === optionValue ? on : selected.includes(v))))
  const selectedLabels = options.filter((o) => selected.includes(o.value)).map((o) => o.label)
  const menuHeading = heading === undefined ? `Filter by ${label.toLowerCase()}` : heading

  return (
    <DropdownMenu open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
      {/* `disabled` on the trigger too, so the menu itself ignores pointer and keyboard events. */}
      <DropdownMenuTrigger asChild disabled={disabled}>
        <FilterButton
          label={label}
          selected={selectedLabels}
          triggerLabel={triggerLabel}
          disabled={disabled}
          className={className}
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent data-slot="filter-menu" align={align} className={cn('w-48', contentClassName)}>
        {menuHeading != null && menuHeading !== false && <DropdownMenuLabel>{menuHeading}</DropdownMenuLabel>}
        {options.map((option) => (
          <DropdownMenuCheckboxItem
            key={option.value}
            checked={selected.includes(option.value)}
            disabled={option.disabled}
            onSelect={(e) => e.preventDefault()}
            onCheckedChange={(on) => toggle(option.value, on === true)}
          >
            {option.icon}
            <span className="min-w-0 flex-1 truncate">{option.label}</span>
            {option.count !== undefined && (
              <span className="ml-auto font-mono text-[11.5px] text-foreground-lighter tabular">{option.count}</span>
            )}
          </DropdownMenuCheckboxItem>
        ))}
        {selected.length > 0 && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={() => setSelected([])}>
              <X /> {clearLabel}
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
