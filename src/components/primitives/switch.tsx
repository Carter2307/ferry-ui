import * as React from 'react'
import { Switch as SwitchPrimitive } from 'radix-ui'

import { cn } from "../../lib/utils"

/** Props of {@link Switch}: the Radix Switch props (`checked`, `defaultChecked`, `onCheckedChange`, `disabled`, `name`…) plus `size`. */
type SwitchProps = React.ComponentProps<typeof SwitchPrimitive.Root> & {
  /**
   * Track size: `md` 34×20px (default: forms, settings rows), `sm` 28×16px (dense lists, table
   * cells, menus). `default` is a deprecated alias of `md`.
   */
  size?: 'sm' | 'md' | 'default'
}

/**
 * On/off toggle (Radix Switch): pill track that fills with solid primary when
 * on, with a white thumb. Controlled with `checked` + `onCheckedChange`, or
 * uncontrolled with `defaultChecked`; `name` + `value` join native form
 * submission. Always give it an accessible name (a `<Label htmlFor>` or
 * `aria-label`).
 *
 * Use it for settings that apply immediately (enable notifications, turn a
 * feature on). For a choice confirmed by a Save / Submit button use `Checkbox`;
 * for more than two states use `RadioGroup` or `ToggleGroup`.
 */
function Switch({ className, size = 'md', ...props }: SwitchProps) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      data-size={size === 'default' ? 'md' : size}
      className={cn(
        'peer group/switch inline-flex shrink-0 cursor-pointer items-center rounded-full border transition-colors outline-none',
        'focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
        'data-[size=md]:h-5 data-[size=md]:w-[34px] data-[size=sm]:h-4 data-[size=sm]:w-7',
        'data-[state=checked]:border-primary-solid-border data-[state=checked]:bg-primary-solid data-[state=unchecked]:border-border-strong data-[state=unchecked]:bg-surface-200',
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          'pointer-events-none block rounded-full bg-surface-100 shadow-sm ring-0 transition-transform data-[state=checked]:bg-primary-foreground',
          'group-data-[size=md]/switch:size-4 group-data-[size=sm]/switch:size-3',
          'data-[state=checked]:translate-x-[15px] data-[state=unchecked]:translate-x-px group-data-[size=sm]/switch:data-[state=checked]:translate-x-[13px]',
          'dark:data-[state=unchecked]:bg-foreground-light',
        )}
      />
    </SwitchPrimitive.Root>
  )
}

export { Switch, type SwitchProps }
