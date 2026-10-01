import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../../lib/utils"
import { Toggle as TogglePrimitive } from "radix-ui"

/**
 * Class recipe shared by `Toggle` and `ToggleGroupItem`: 13px medium text in
 * `foreground-lighter`, 6px radius, a `surface-200` hover and a faint
 * foreground tint when pressed (`data-state=on`).
 *
 * Variants: `default` (transparent, for toolbars) and `outline` (bordered
 * control on `surface-100`). Sizes follow the `Button` scale: `tiny` (26px),
 * `sm` (30px, the default), `md` (34px).
 *
 * Use it to style a non-Radix element like a toggle; to render one, use
 * `<Toggle>` instead.
 */
const toggleVariants = cva(
  "inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-md text-[13px] font-medium whitespace-nowrap text-foreground-lighter transition-colors outline-none hover:bg-surface-200 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-foreground/[0.08] data-[state=on]:text-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        /** Transparent until hovered or pressed (toolbar formatting buttons). */
        default: "bg-transparent",
        /** Bordered control on surface-100, a shade darker when pressed. */
        outline:
          "border border-border-strong bg-surface-100 hover:bg-surface-200 data-[state=on]:bg-surface-200 dark:data-[state=on]:bg-surface-300",
      },
      size: {
        /** 26px tall, 12px text (dense toolbars); pairs with the `tiny` Button. */
        tiny: "h-[26px] min-w-[26px] px-1.5 text-xs",
        /** 30px tall, pairs with the default `sm` Button. */
        sm: "h-[30px] min-w-[30px] px-2",
        /** 34px tall, pairs with the `md` Button and the default `Input`. */
        md: "h-[34px] min-w-[34px] px-2.5",
        /** Deprecated alias of `sm` (30px). */
        default: "h-[30px] min-w-[30px] px-2",
        /** Deprecated alias of `md` (34px). */
        lg: "h-[34px] min-w-[34px] px-2.5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "sm",
    },
  }
)

/** Props of {@link Toggle}: the Radix Toggle props (`pressed`, `defaultPressed`, `onPressedChange`, `disabled`…) plus the style variants. */
type ToggleProps = React.ComponentProps<typeof TogglePrimitive.Root> & {
  /** `default` = transparent until hovered/pressed; `outline` = bordered control on surface-100. */
  variant?: VariantProps<typeof toggleVariants>["variant"]
  /**
   * Height, on the `Button` scale: `tiny` 26px, `sm` 30px (default), `md` 34px.
   * `default` and `lg` are deprecated aliases of `sm` and `md`.
   */
  size?: VariantProps<typeof toggleVariants>["size"]
}

/**
 * A two-state button that stays pressed (`aria-pressed`) until clicked again:
 * bold/italic in an editor toolbar, "show archived", "follow" style switches.
 *
 * Control it with `pressed` + `onPressedChange`, or leave it uncontrolled with
 * `defaultPressed`. Icon-only toggles need an `aria-label`.
 *
 * Not for settings that apply immediately and read as on/off (use `Switch`),
 * for picking one option among several (use `ToggleGroup type="single"` or
 * `Tabs`), or for one-shot actions (use `Button`).
 */
function Toggle({
  className,
  variant,
  size,
  ...props
}: ToggleProps) {
  return (
    <TogglePrimitive.Root
      data-slot="toggle"
      className={cn(toggleVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Toggle, toggleVariants, type ToggleProps }
