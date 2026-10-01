import * as React from "react"
import { cn } from "../../lib/utils"
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from "lucide-react"
import { Select as SelectPrimitive } from "radix-ui"

/**
 * Native-like dropdown for picking one value from a short, known list (Radix
 * Select). Compose it as `Select` > `SelectTrigger` (> `SelectValue`) +
 * `SelectContent` > `SelectItem` (optionally grouped with `SelectGroup` /
 * `SelectLabel` / `SelectSeparator`). Controlled with `value` + `onValueChange`,
 * or uncontrolled with `defaultValue` (a controlled `value=""` shows the
 * `SelectValue` placeholder); `open` / `defaultOpen` + `onOpenChange` control
 * the popup, `name` + `required` join native form submission.
 *
 * Use it for roughly 4–15 plain options (language, role, currency). For 2–5
 * options that should stay visible use `RadioGroup`; for long or searchable
 * lists use a combobox built on `Command` + `Popover`; for actions (not values)
 * use `DropdownMenu`.
 */
function Select({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Root>) {
  return <SelectPrimitive.Root data-slot="select" {...props} />
}

/** Groups related `SelectItem`s under a `SelectLabel` (exposed as a labelled group to assistive tech). */
function SelectGroup({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Group>) {
  return <SelectPrimitive.Group data-slot="select-group" {...props} />
}

/**
 * Renders the selected item's text inside `SelectTrigger`. Pass `placeholder`
 * for the empty state (shown muted); pass children only to customise how the
 * current value is displayed.
 */
function SelectValue({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Value>) {
  return <SelectPrimitive.Value data-slot="select-value" {...props} />
}

/** Props of {@link SelectTrigger}: the Radix trigger props (`id`, `disabled`, `aria-*`…) plus `size`. */
type SelectTriggerProps = React.ComponentProps<typeof SelectPrimitive.Trigger> & {
  /**
   * Height, on the `Input` / `Button` scale: `tiny` 26px (toolbars), `sm` 30px
   * (filters, dense forms), `md` 34px (default: form fields). `default` is a
   * deprecated alias of `md`.
   */
  size?: "tiny" | "sm" | "md" | "default"
}

/**
 * The button that opens the list: same border, surface and focus/invalid
 * states as `Input`, with a chevron on the right. It is `w-fit` by default;
 * add `className="w-full"` inside forms. Set `aria-invalid` for the error
 * border and give it an `id` matching a `<Label htmlFor>` (or an `aria-label`).
 * Children are usually a single `SelectValue`.
 */
function SelectTrigger({
  className,
  size = "md",
  children,
  ...props
}: SelectTriggerProps) {
  return (
    <SelectPrimitive.Trigger
      data-slot="select-trigger"
      data-size={size === "default" ? "md" : size}
      className={cn(
        "flex w-fit cursor-pointer items-center justify-between gap-2 rounded-md border border-border-strong bg-surface-100 px-3 text-sm whitespace-nowrap text-foreground transition-[border-color,box-shadow] outline-none hover:border-border-stronger focus-visible:border-primary-bright/70 focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-60 aria-invalid:border-destructive aria-invalid:focus-visible:ring-destructive/80 data-[placeholder]:text-foreground-lighter data-[size=md]:h-[34px] data-[size=sm]:h-[30px] data-[size=sm]:px-2.5 data-[size=sm]:text-[13px] data-[size=tiny]:h-[26px] data-[size=tiny]:px-2 data-[size=tiny]:text-xs dark:bg-surface-200 *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-2 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-muted-foreground",
        className
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <ChevronDownIcon className="size-4 opacity-50" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  )
}

/**
 * The portaled popup holding the items: raised popover surface, 8px radius,
 * overlay shadow, scroll buttons when the list overflows.
 *
 * `position="item-aligned"` (default) overlaps the trigger so the selected item
 * sits on top of it, like a native select. Use `position="popper"` to drop the
 * list below the trigger, at least as wide as the trigger (it then honours `side`,
 * `sideOffset` and `align`).
 */
function SelectContent({
  className,
  children,
  position = "item-aligned",
  align = "center",
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Content>) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        data-slot="select-content"
        className={cn(
          "relative z-50 max-h-(--radix-select-content-available-height) min-w-[8rem] origin-(--radix-select-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-lg border border-border-strong bg-popover text-popover-foreground shadow-overlay data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 motion-safe:data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 motion-safe:data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
          position === "popper" &&
            "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
          className
        )}
        position={position}
        align={align}
        {...props}
      >
        <SelectScrollUpButton />
        <SelectPrimitive.Viewport
          className={cn(
            "p-1",
            position === "popper" &&
              "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)] scroll-my-1"
          )}
        >
          {children}
        </SelectPrimitive.Viewport>
        <SelectScrollDownButton />
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  )
}

/** Small uppercase monospace heading for a `SelectGroup`. Not selectable. */
function SelectLabel({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Label>) {
  return (
    <SelectPrimitive.Label
      data-slot="select-label"
      className={cn("px-2 pt-2 pb-1 font-mono text-[11px] tracking-[0.06em] text-foreground-lighter uppercase", className)}
      {...props}
    />
  )
}

/**
 * One selectable option. `value` must be a non-empty string (use a sentinel
 * such as `"none"` instead of `""`). A check mark appears on the right for the
 * selected item; `disabled` greys it out. Children may include a leading icon,
 * which is sized and muted automatically.
 */
function SelectItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Item>) {
  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      className={cn(
        "relative flex w-full cursor-default items-center gap-2 rounded-[5px] py-1.5 pr-8 pl-2 text-[13px] text-foreground-light outline-hidden select-none focus:bg-surface-200 focus:text-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-muted-foreground *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2",
        className
      )}
      {...props}
    >
      <span
        data-slot="select-item-indicator"
        className="absolute right-2 flex size-3.5 items-center justify-center"
      >
        <SelectPrimitive.ItemIndicator>
          <CheckIcon className="size-4" />
        </SelectPrimitive.ItemIndicator>
      </span>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  )
}

/** Hairline between groups of items. */
function SelectSeparator({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Separator>) {
  return (
    <SelectPrimitive.Separator
      data-slot="select-separator"
      className={cn("pointer-events-none -mx-1 my-1 h-px bg-border", className)}
      {...props}
    />
  )
}

/** Chevron shown at the top of `SelectContent` when items overflow upward. Rendered automatically by `SelectContent`; exported only for custom content wrappers. */
function SelectScrollUpButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollUpButton>) {
  return (
    <SelectPrimitive.ScrollUpButton
      data-slot="select-scroll-up-button"
      className={cn(
        "flex cursor-default items-center justify-center py-1",
        className
      )}
      {...props}
    >
      <ChevronUpIcon className="size-4" />
    </SelectPrimitive.ScrollUpButton>
  )
}

/** Chevron shown at the bottom of `SelectContent` when items overflow downward. Rendered automatically by `SelectContent`; exported only for custom content wrappers. */
function SelectScrollDownButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollDownButton>) {
  return (
    <SelectPrimitive.ScrollDownButton
      data-slot="select-scroll-down-button"
      className={cn(
        "flex cursor-default items-center justify-center py-1",
        className
      )}
      {...props}
    >
      <ChevronDownIcon className="size-4" />
    </SelectPrimitive.ScrollDownButton>
  )
}

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
  type SelectTriggerProps,
}
