import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from "../../lib/utils"

/**
 * Class recipe behind {@link Input}. Use it to give a non-input element (a fake
 * trigger, a read-only value box) the exact same field look:
 * `inputVariants({ size: 'sm', mono: true })`.
 */
const inputVariants = cva(
  [
    'w-full min-w-0 rounded-md border border-border-strong bg-surface-100 text-foreground dark:bg-surface-200',
    'placeholder:text-foreground-lighter selection:bg-primary-soft',
    'transition-[border-color,box-shadow] outline-none',
    'hover:border-border-stronger focus-visible:border-primary-bright/70 focus-visible:ring-2 focus-visible:ring-ring',
    'disabled:cursor-not-allowed disabled:opacity-60',
    'read-only:bg-surface-200 read-only:focus-visible:ring-1 dark:read-only:bg-surface-200/60',
    // Stacked variant: it is emitted after `focus-visible:ring-ring`, so a focused invalid field keeps a visible ring.
    'aria-invalid:border-destructive aria-invalid:focus-visible:ring-destructive/80',
    'file:mr-3 file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground',
  ],
  {
    variants: {
      size: {
        tiny: 'h-[26px] px-2 text-xs',
        sm: 'h-[30px] px-2.5 text-[13px]',
        md: 'h-[34px] px-3 text-sm',
        lg: 'h-[38px] px-3 text-sm',
      },
      mono: {
        true: 'font-mono text-[13px]',
        false: '',
      },
    },
    defaultVariants: { size: 'md', mono: false },
  },
)

/** Props of {@link Input}: every native `<input>` prop (except the numeric `size`) plus the variants below. */
interface InputProps extends Omit<React.ComponentProps<'input'>, 'size'> {
  /**
   * Control height, matched to Button sizes so fields and buttons line up in a row:
   * `tiny` 26px (toolbars, table cells), `sm` 30px (filters, dense forms),
   * `md` 34px (default form field), `lg` 38px (sign-in / hero forms).
   */
  size?: VariantProps<typeof inputVariants>['size']
  /**
   * Monospace face at 13px. Use for machine values the user types or copies
   * (identifiers, slugs, URLs, keys, hashes); keep prose fields in the sans face.
   */
  mono?: VariantProps<typeof inputVariants>['mono']
}

/**
 * Single-line text field: 1px strong border, 6px radius, raised surface, primary
 * focus ring. Set `aria-invalid` to paint the error border (and a red focus ring), `readOnly` for a
 * copyable value (dimmed background), `disabled` for an unavailable field.
 * Controlled with `value` + `onChange`, or uncontrolled with `defaultValue`.
 * Pair it with a `<Label htmlFor>` and a helper / error line linked through
 * `aria-describedby`.
 *
 * Use `Textarea` for multi-line text, `Select` for a fixed list of options,
 * and a search/command pattern (not a bare Input) for filtering large lists.
 */
function Input({ className, type, size, mono, ...props }: InputProps) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(inputVariants({ size, mono }), className)}
      {...props}
    />
  )
}

export { Input, inputVariants, type InputProps }
