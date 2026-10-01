import * as React from 'react'
import { Label as LabelPrimitive } from 'radix-ui'

import { cn } from "../../lib/utils"

/**
 * Accessible form label (14px, medium weight). Link it to its control with `htmlFor` +
 * the control's `id`, or wrap the control inside it; clicking the label then focuses or
 * toggles the control. It dims automatically when the preceding sibling control has the
 * `peer` class and is disabled, or when an ancestor with the `group` class has
 * `data-disabled="true"`. Do NOT use it as a generic caption for non-form content.
 */
function Label({ className, ...props }: React.ComponentProps<typeof LabelPrimitive.Root>) {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={cn(
        'flex items-center gap-2 text-sm leading-snug font-medium text-foreground select-none',
        'group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50',
        className,
      )}
      {...props}
    />
  )
}

export { Label }
