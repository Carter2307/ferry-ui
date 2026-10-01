import * as React from "react"
import { type VariantProps } from "class-variance-authority"
import { cn } from "../../lib/utils"
import { ToggleGroup as ToggleGroupPrimitive } from "radix-ui"

import { toggleVariants } from "./toggle"

const ToggleGroupContext = React.createContext<
  VariantProps<typeof toggleVariants> & {
    spacing?: number
  }
>({
  size: "sm",
  variant: "default",
  spacing: 0,
})

/** Style props a `ToggleGroup` passes down to every `ToggleGroupItem`. */
type ToggleGroupStyleProps = {
  /** `default` = transparent items; `outline` = bordered segmented control on surface-100. Applied to every item. */
  variant?: VariantProps<typeof toggleVariants>["variant"]
  /**
   * Item height, on the `Button` scale: `tiny` 26px, `sm` 30px (default), `md` 34px. Applied to
   * every item. `default` and `lg` are deprecated aliases of `sm` and `md`.
   */
  size?: VariantProps<typeof toggleVariants>["size"]
}

/**
 * Props of {@link ToggleGroup}: the Radix ToggleGroup props (`type`, `value`,
 * `defaultValue`, `onValueChange`, `disabled`, `rovingFocus`…) plus the style
 * props and `spacing`.
 */
type ToggleGroupProps = React.ComponentProps<typeof ToggleGroupPrimitive.Root> &
  ToggleGroupStyleProps & {
    /**
     * Gap between items in Tailwind spacing units (1 = 4px). `0` (default)
     * joins the items into a single segmented control.
     */
    spacing?: number
  }

/**
 * Props of {@link ToggleGroupItem}: the Radix item props (`value`, `disabled`…).
 * `variant` / `size` only apply when the parent group sets none.
 */
type ToggleGroupItemProps = React.ComponentProps<typeof ToggleGroupPrimitive.Item> & ToggleGroupStyleProps

/**
 * A row of toggles sharing one value: `type="single"` for a segmented control
 * (grid/list view, light/dark/auto, align left/center/right) or
 * `type="multiple"` for independent flags (bold + italic + underline).
 *
 * `variant` and `size` set on the group apply to every item. With the default
 * `spacing={0}` items are joined into one control (shared borders, rounded
 * outer corners only); a positive `spacing` separates them.
 *
 * Control it with `value` + `onValueChange` or leave it uncontrolled with
 * `defaultValue`. In single mode, clicking the active item emits `""`:
 * ignore empty values in `onValueChange` if one option must stay selected.
 * Give the group an `aria-label` and icon-only items their own `aria-label`.
 *
 * Not for switching between panels of content (use `Tabs`) or for picking from
 * a long list (use `Select` / `RadioGroup`).
 */
function ToggleGroup({
  className,
  variant,
  size,
  spacing = 0,
  style,
  children,
  ...props
}: ToggleGroupProps) {
  return (
    <ToggleGroupPrimitive.Root
      data-slot="toggle-group"
      data-variant={variant}
      data-size={size}
      data-spacing={spacing}
      style={{ "--gap": spacing, ...style } as React.CSSProperties}
      className={cn(
        "group/toggle-group flex w-fit items-center gap-[--spacing(var(--gap))] rounded-md",
        className
      )}
      {...props}
    >
      <ToggleGroupContext.Provider value={{ variant, size, spacing }}>
        {children}
      </ToggleGroupContext.Provider>
    </ToggleGroupPrimitive.Root>
  )
}

/**
 * One option of a `ToggleGroup`; `value` identifies it. Inherits `variant` and
 * `size` from the group (its own props only apply when the group sets none).
 * Icon-only items need an `aria-label`; wrap them in `Hint` for a tooltip.
 */
function ToggleGroupItem({
  className,
  children,
  variant,
  size,
  ...props
}: ToggleGroupItemProps) {
  const context = React.useContext(ToggleGroupContext)

  return (
    <ToggleGroupPrimitive.Item
      data-slot="toggle-group-item"
      data-variant={context.variant || variant}
      data-size={context.size || size}
      data-spacing={context.spacing}
      className={cn(
        toggleVariants({
          variant: context.variant || variant,
          size: context.size || size,
        }),
        "w-auto min-w-0 shrink-0 px-3 focus:z-10 focus-visible:z-10",
        "data-[spacing=0]:rounded-none data-[spacing=0]:shadow-none data-[spacing=0]:first:rounded-l-md data-[spacing=0]:last:rounded-r-md data-[spacing=0]:data-[variant=outline]:border-l-0 data-[spacing=0]:data-[variant=outline]:first:border-l",
        className
      )}
      {...props}
    >
      {children}
    </ToggleGroupPrimitive.Item>
  )
}

export { ToggleGroup, ToggleGroupItem, type ToggleGroupProps, type ToggleGroupItemProps }
