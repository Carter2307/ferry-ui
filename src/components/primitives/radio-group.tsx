import * as React from "react"
import { RadioGroup as RadioGroupPrimitive } from "radix-ui"

import { cn } from "../../lib/utils"

/**
 * Single-choice group (Radix RadioGroup): arrow keys move between items and
 * select them, only one value is active. Controlled with `value` +
 * `onValueChange`, or uncontrolled with `defaultValue`; `name` + `required`
 * make it take part in native form submission. Lays items out in a `grid gap-3`
 * column by default; override with `className` (e.g. `flex gap-4` for a row).
 * Give the group an accessible name (`aria-label` or `aria-labelledby`).
 *
 * Use it for 2–5 mutually exclusive options that should all stay visible.
 * For longer lists use `Select`; for an on/off choice use `Switch` or `Checkbox`;
 * for a compact segmented control use `ToggleGroup`; for options that need a
 * title + description card use the `RadioCardGroup` pattern.
 */
function RadioGroup({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Root>) {
  return (
    <RadioGroupPrimitive.Root
      data-slot="radio-group"
      className={cn("grid gap-3", className)}
      {...props}
    />
  )
}

/**
 * One option of a {@link RadioGroup}: a 16px circle with a strong border when
 * off, a solid primary fill with a white dot when selected (the same language
 * as `Checkbox`). Give it a `value`, then either wrap it with its text in a
 * `<Label>` or give it an `id` matched by `<Label htmlFor>`. Set `aria-invalid`
 * for the error border, `disabled` to grey out a single option.
 */
function RadioGroupItem({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Item>) {
  return (
    <RadioGroupPrimitive.Item
      data-slot="radio-group-item"
      className={cn(
        "peer aspect-square size-4 shrink-0 cursor-pointer rounded-full border border-border-stronger bg-surface-100 transition-colors outline-none dark:data-[state=unchecked]:bg-surface-200",
        "focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive",
        "data-[state=checked]:border-primary-solid-border data-[state=checked]:bg-primary-solid",
        className
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator
        data-slot="radio-group-indicator"
        className="flex size-full items-center justify-center"
      >
        <span className="size-1.5 rounded-full bg-primary-foreground" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  )
}

export { RadioGroup, RadioGroupItem }
