import * as React from 'react'

/** Options of {@link useCommandShortcut}. */
export interface CommandShortcutOptions {
  /** Letter pressed together with ⌘ (Apple) / Ctrl (elsewhere). Case-insensitive. Defaults to `"k"`. */
  key?: string
  /** Listens only while `true` (e.g. `false` while a modal flow owns the keyboard). Defaults to `true`. */
  enabled?: boolean
}

/**
 * Global ⌘K (Apple) / Ctrl+K (elsewhere) keyboard shortcut, or another letter with `key`. Calls
 * `handler` on every press anywhere in the window, including inside text fields, and prevents the
 * browser default (e.g. focusing the address bar). Presses with Alt or Shift are ignored. The
 * latest `handler` is always called, so an inline arrow function is fine.
 *
 * Use it once near the app root, next to the state of your `CommandMenu`:
 *
 * ```tsx
 * const [open, setOpen] = React.useState(false)
 * useCommandShortcut(() => setOpen((o) => !o))
 * <CommandMenu open={open} onOpenChange={setOpen} groups={groups} />
 * ```
 *
 * The second argument is either the letter (`useCommandShortcut(fn, 'j')`) or an options object
 * (`{ key, enabled }`). `AppShell` wires it for you through its `onCommandShortcut` prop, and
 * `CommandMenu` through its `shortcut` prop. Do NOT call it in several components for the same
 * letter (each press would fire once per call; pick one of these three), use it for shortcuts
 * scoped to one widget (handle `onKeyDown` on that widget instead) or for several letters at once
 * (call it once per letter).
 */
export function useCommandShortcut(
  handler: (event: KeyboardEvent) => void,
  options: string | CommandShortcutOptions = {},
): void {
  const { key = 'k', enabled = true } = typeof options === 'string' ? { key: options } : options
  const handlerRef = React.useRef(handler)
  React.useEffect(() => {
    handlerRef.current = handler
  })

  React.useEffect(() => {
    if (!enabled) return
    const letter = key.toLowerCase()
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key?.toLowerCase() !== letter) return
      if (!(event.metaKey || event.ctrlKey) || event.altKey || event.shiftKey) return
      event.preventDefault()
      handlerRef.current(event)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [enabled, key])
}
