import * as React from 'react'

import { cn } from '../../lib/utils'

/** Props of {@link Kbd}: every native `<kbd>` attribute. */
export type KbdProps = React.ComponentProps<'kbd'>

/**
 * Keyboard key hint: a tiny 18px monospace keycap (`⌘`, `K`, `Esc`, `↵`).
 *
 * Use it to show shortcuts next to buttons, in search fields, menus and help text. Render one
 * `<Kbd>` per key (`<Kbd>⌘</Kbd> <Kbd>K</Kbd>`) or a whole chord in one cap (`⌘K`, or `Ctrl K`
 * with a space). Use the `useModKey()` hook for the platform's modifier (hydration-safe; the
 * `modKey` constant is fine in client-only code). It is presentational only: bind the shortcut yourself. Do NOT use it for inline code or values (use a
 * `<code>` element).
 */
export function Kbd({ className, ...props }: KbdProps) {
  return (
    <kbd
      data-slot="kbd"
      className={cn(
        'inline-flex h-[18px] min-w-[18px] items-center justify-center rounded-[4px] border border-border-strong bg-surface-200 px-1 font-mono text-[10.5px] leading-none text-foreground-lighter',
        className,
      )}
      {...props}
    />
  )
}
