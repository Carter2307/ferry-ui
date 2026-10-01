import * as React from "react"
import { cn } from "../../lib/utils"
import { Separator as SeparatorPrimitive } from "radix-ui"

/**
 * 1px hairline in the `border` color that divides content, horizontally (full width) or
 * vertically (full height of a flex parent — give the parent a height or `items-stretch`).
 * Decorative by default (hidden from screen readers); set `decorative={false}` when the
 * split is meaningful, e.g. between groups of toolbar actions. For section spacing
 * without a line, use margin or gap instead.
 */
function Separator({
  className,
  orientation = "horizontal",
  decorative = true,
  ...props
}: React.ComponentProps<typeof SeparatorPrimitive.Root>) {
  return (
    <SeparatorPrimitive.Root
      data-slot="separator"
      decorative={decorative}
      orientation={orientation}
      className={cn(
        "shrink-0 bg-border data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px",
        className
      )}
      {...props}
    />
  )
}

export { Separator }
