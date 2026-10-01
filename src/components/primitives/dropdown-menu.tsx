import * as React from "react"
import { cn } from "../../lib/utils"
import { CheckIcon, ChevronRightIcon, CircleIcon } from "lucide-react"
import { DropdownMenu as DropdownMenuPrimitive } from "radix-ui"

/**
 * Root of a dropdown menu: a short list of actions or options opened from a trigger.
 * Use it for contextual actions (a table row "more" menu, an account menu, a view-options menu).
 * Do NOT use it to pick a form value (use Select) or to show rich, non-menu content (use Popover).
 * Supports controlled `open` + `onOpenChange` or uncontrolled `defaultOpen`; pass `modal={false}`
 * to keep the rest of the page interactive while it is open.
 */
function DropdownMenu({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Root>) {
  return <DropdownMenuPrimitive.Root data-slot="dropdown-menu" {...props} />
}

/**
 * Renders its children into `document.body`. DropdownMenuContent already portals itself, so use
 * this only to wrap a DropdownMenuSubContent that must escape a clipping or transformed parent.
 */
function DropdownMenuPortal({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Portal>) {
  return (
    <DropdownMenuPrimitive.Portal data-slot="dropdown-menu-portal" {...props} />
  )
}

/**
 * The element that opens the menu (click, Enter, Space or ArrowDown). Use `asChild` to render your
 * own Button so it keeps its styling while receiving the menu's ARIA wiring.
 */
function DropdownMenuTrigger({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Trigger>) {
  return (
    <DropdownMenuPrimitive.Trigger
      data-slot="dropdown-menu-trigger"
      {...props}
    />
  )
}

/**
 * The floating menu panel: portaled, raised popover surface, strong 1px border, 8px radius,
 * overlay shadow. Opens 4px from the trigger; position it with `side` and `align`
 * ("start" | "center" | "end"). Scrolls when taller than the available space.
 */
function DropdownMenuContent({
  className,
  sideOffset = 4,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Content>) {
  return (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Content
        data-slot="dropdown-menu-content"
        sideOffset={sideOffset}
        className={cn(
          "z-50 max-h-(--radix-dropdown-menu-content-available-height) min-w-[8rem] origin-(--radix-dropdown-menu-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-lg border border-border-strong bg-popover p-1 text-popover-foreground shadow-overlay data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 motion-safe:data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 motion-safe:data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
          className
        )}
        {...props}
      />
    </DropdownMenuPrimitive.Portal>
  )
}

/**
 * Semantic group of related items (no visual styling). Pair it with a DropdownMenuLabel and
 * separate groups with DropdownMenuSeparator.
 */
function DropdownMenuGroup({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Group>) {
  return (
    <DropdownMenuPrimitive.Group data-slot="dropdown-menu-group" {...props} />
  )
}

/** Props of {@link DropdownMenuItem}: the Radix item props (`onSelect`, `disabled`, `asChild`…) plus the options below. */
type DropdownMenuItemProps = React.ComponentProps<typeof DropdownMenuPrimitive.Item> & {
  /** Adds left padding so the text lines up with checkbox / radio items and inset labels. */
  inset?: boolean
  /** `destructive` colors the item for irreversible actions (delete, remove, revoke). */
  variant?: "default" | "destructive"
}

/**
 * A single actionable row: 13px text, icons auto-sized to 16px and muted. Run the action in
 * `onSelect` (not `onClick`) so keyboard selection works. Use `variant="destructive"` for
 * irreversible actions, `inset` to align with checkbox / radio items, `disabled` for unavailable
 * actions and `asChild` to render a link.
 */
function DropdownMenuItem({
  className,
  inset,
  variant = "default",
  ...props
}: DropdownMenuItemProps) {
  return (
    <DropdownMenuPrimitive.Item
      data-slot="dropdown-menu-item"
      data-inset={inset}
      data-variant={variant}
      className={cn(
        "relative flex cursor-default items-center gap-2 rounded-[5px] px-2 py-1.5 text-[13px] text-foreground-light outline-hidden select-none focus:bg-surface-200 focus:text-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[inset]:pl-8 data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 data-[variant=destructive]:focus:text-destructive dark:data-[variant=destructive]:focus:bg-destructive/20 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-muted-foreground data-[variant=destructive]:*:[svg]:text-destructive!",
        className
      )}
      {...props}
    />
  )
}

/**
 * An option that toggles on and off, marked with a check (column visibility, display toggles).
 * Control it with `checked` + `onCheckedChange`; call `event.preventDefault()` in `onSelect` to
 * keep the menu open while the user toggles several options.
 */
function DropdownMenuCheckboxItem({
  className,
  children,
  checked,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.CheckboxItem>) {
  return (
    <DropdownMenuPrimitive.CheckboxItem
      data-slot="dropdown-menu-checkbox-item"
      className={cn(
        "relative flex cursor-default items-center gap-2 rounded-[5px] py-1.5 pr-2 pl-8 text-[13px] text-foreground-light outline-hidden select-none focus:bg-surface-200 focus:text-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      checked={checked}
      {...props}
    >
      <span className="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center">
        <DropdownMenuPrimitive.ItemIndicator>
          <CheckIcon className="size-4" />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </DropdownMenuPrimitive.CheckboxItem>
  )
}

/**
 * Holds mutually exclusive DropdownMenuRadioItems (sort order, density, theme). Control it with
 * `value` + `onValueChange`.
 */
function DropdownMenuRadioGroup({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.RadioGroup>) {
  return (
    <DropdownMenuPrimitive.RadioGroup
      data-slot="dropdown-menu-radio-group"
      {...props}
    />
  )
}

/** One option of a DropdownMenuRadioGroup, marked with a dot when it is the selected value. */
function DropdownMenuRadioItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.RadioItem>) {
  return (
    <DropdownMenuPrimitive.RadioItem
      data-slot="dropdown-menu-radio-item"
      className={cn(
        "relative flex cursor-default items-center gap-2 rounded-[5px] py-1.5 pr-2 pl-8 text-[13px] text-foreground-light outline-hidden select-none focus:bg-surface-200 focus:text-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      <span className="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center">
        <DropdownMenuPrimitive.ItemIndicator>
          <CircleIcon className="size-2 fill-current" />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </DropdownMenuPrimitive.RadioItem>
  )
}

/** Props of {@link DropdownMenuLabel}: the Radix label props plus `inset`. */
type DropdownMenuLabelProps = React.ComponentProps<typeof DropdownMenuPrimitive.Label> & {
  /** Adds left padding so the text lines up with checkbox / radio items. */
  inset?: boolean
}

/**
 * Non-interactive section heading in the mono uppercase label style (11px, tracked, lighter text).
 * Use `inset` to align it with checkbox / radio items.
 */
function DropdownMenuLabel({
  className,
  inset,
  ...props
}: DropdownMenuLabelProps) {
  return (
    <DropdownMenuPrimitive.Label
      data-slot="dropdown-menu-label"
      data-inset={inset}
      className={cn(
        "px-2 pt-2 pb-1 font-mono text-[11px] tracking-[0.06em] text-foreground-lighter uppercase data-[inset]:pl-8",
        className
      )}
      {...props}
    />
  )
}

/** Hairline divider between groups of items. */
function DropdownMenuSeparator({
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Separator>) {
  return (
    <DropdownMenuPrimitive.Separator
      data-slot="dropdown-menu-separator"
      className={cn("-mx-1 my-1 h-px bg-border", className)}
      {...props}
    />
  )
}

/**
 * Right-aligned keyboard hint inside an item (display only: it does not bind the key). Use the
 * platform modifier label ("⌘" or "Ctrl") from `useModKey()` (hydration-safe) or the `modKey`
 * constant (client-only code) so the hint matches the user's OS.
 */
function DropdownMenuShortcut({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="dropdown-menu-shortcut"
      className={cn(
        "ml-auto font-mono text-[11px] tracking-widest text-foreground-lighter",
        className
      )}
      {...props}
    />
  )
}

/**
 * Root of a nested submenu. Keep nesting to one level, for secondary choices such as
 * "Move to…" or "Change role".
 */
function DropdownMenuSub({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Sub>) {
  return <DropdownMenuPrimitive.Sub data-slot="dropdown-menu-sub" {...props} />
}

/** Props of {@link DropdownMenuSubTrigger}: the Radix sub-trigger props plus `inset`. */
type DropdownMenuSubTriggerProps = React.ComponentProps<typeof DropdownMenuPrimitive.SubTrigger> & {
  /** Adds left padding so the text lines up with checkbox / radio items. */
  inset?: boolean
}

/**
 * Item that opens its submenu on hover, click or ArrowRight; renders a trailing chevron and stays
 * highlighted while the submenu is open. Supports `inset`.
 */
function DropdownMenuSubTrigger({
  className,
  inset,
  children,
  ...props
}: DropdownMenuSubTriggerProps) {
  return (
    <DropdownMenuPrimitive.SubTrigger
      data-slot="dropdown-menu-sub-trigger"
      data-inset={inset}
      className={cn(
        "flex cursor-default items-center gap-2 rounded-[5px] px-2 py-1.5 text-[13px] text-foreground-light outline-hidden select-none focus:bg-surface-200 focus:text-foreground data-[inset]:pl-8 data-[state=open]:bg-surface-200 data-[state=open]:text-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-muted-foreground",
        className
      )}
      {...props}
    >
      {children}
      <ChevronRightIcon className="ml-auto size-4" />
    </DropdownMenuPrimitive.SubTrigger>
  )
}

/**
 * The floating panel of a submenu, same surface as DropdownMenuContent. It is not portaled: wrap
 * it in DropdownMenuPortal so it is never clipped by the parent panel.
 */
function DropdownMenuSubContent({
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.SubContent>) {
  return (
    <DropdownMenuPrimitive.SubContent
      data-slot="dropdown-menu-sub-content"
      className={cn(
        "z-50 min-w-[8rem] origin-(--radix-dropdown-menu-content-transform-origin) overflow-hidden rounded-lg border border-border-strong bg-popover p-1 text-popover-foreground shadow-overlay data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 motion-safe:data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 motion-safe:data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
        className
      )}
      {...props}
    />
  )
}

export {
  DropdownMenu,
  DropdownMenuPortal,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  type DropdownMenuItemProps,
  type DropdownMenuLabelProps,
  type DropdownMenuSubTriggerProps,
}
