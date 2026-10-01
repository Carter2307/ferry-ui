import * as React from 'react'
import { CheckIcon, MinusIcon } from 'lucide-react'
import { Checkbox as CheckboxPrimitive } from 'radix-ui'

import { cn } from "../../lib/utils"

/**
 * Square 16px checkbox (Radix Checkbox): strong border when off, solid primary
 * fill with a white check when on, and the same fill with a dash when
 * `checked="indeterminate"` (a "select all" whose children are only partly
 * selected). Controlled with `checked` + `onCheckedChange` (which receives
 * `true`, `false` or `'indeterminate'`), or uncontrolled with `defaultChecked`.
 * `name` + `value` + `required` join native form submission. Set `aria-invalid`
 * for the error border.
 *
 * Use it for independent on/off choices that are applied on submit (terms,
 * multi-select lists, table row selection). Wrap it with a `<Label>` (or link
 * one via `id` / `htmlFor`) so the text is clickable, or give it an
 * `aria-label` when it stands alone (table cells). For a setting that takes
 * effect immediately use `Switch`; for one choice among several use `RadioGroup`.
 */
function Checkbox({ className, ...props }: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        'peer group/checkbox size-4 shrink-0 cursor-pointer rounded-[4px] border border-border-stronger bg-surface-100 transition-colors outline-none dark:data-[state=unchecked]:bg-surface-200',
        'focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive',
        'data-[state=checked]:border-primary-solid-border data-[state=checked]:bg-primary-solid data-[state=checked]:text-primary-foreground',
        'data-[state=indeterminate]:border-primary-solid-border data-[state=indeterminate]:bg-primary-solid data-[state=indeterminate]:text-primary-foreground',
        className,
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator data-slot="checkbox-indicator" className="grid place-content-center text-current transition-none">
        <CheckIcon className="size-3 group-data-[state=indeterminate]/checkbox:hidden" strokeWidth={3} />
        <MinusIcon className="hidden size-3 group-data-[state=indeterminate]/checkbox:block" strokeWidth={3} />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}

export { Checkbox }
