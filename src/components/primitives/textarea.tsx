import * as React from 'react'

import { cn } from "../../lib/utils"

/** Props of {@link Textarea}: every native `<textarea>` prop plus `mono`. */
type TextareaProps = React.ComponentProps<'textarea'> & {
  /**
   * Monospace face at 13px with relaxed line height. Use for code-like content
   * (JSON, config snippets, certificates, lists of keys); keep prose in sans.
   */
  mono?: boolean
}

/**
 * Multi-line text field with the same border, surface and focus/invalid states
 * as `Input`. It grows with its content (`field-sizing: content`) from an 80px
 * minimum; cap it with `max-h-*` (it then scrolls), or opt out of auto-growth
 * with `className="field-sizing-fixed"` (then `rows` or an `h-*` class sets the height).
 *
 * Use it for descriptions, messages and pasted blocks. For a single line use
 * `Input`; for real code editing prefer a dedicated editor component.
 */
function Textarea({ className, mono = false, ...props }: TextareaProps) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        'flex field-sizing-content min-h-20 w-full rounded-md border border-border-strong bg-surface-100 px-3 py-2 text-sm text-foreground dark:bg-surface-200',
        'placeholder:text-foreground-lighter transition-[border-color,box-shadow] outline-none',
        'hover:border-border-stronger focus-visible:border-primary-bright/70 focus-visible:ring-2 focus-visible:ring-ring',
        'disabled:cursor-not-allowed disabled:opacity-60 aria-invalid:border-destructive aria-invalid:focus-visible:ring-destructive/80',
        mono && 'font-mono text-[13px] leading-relaxed',
        className,
      )}
      {...props}
    />
  )
}

export { Textarea, type TextareaProps }
