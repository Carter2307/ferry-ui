import * as React from 'react'

const subscribe = () => () => {}

/**
 * `false` on the server and during hydration, `true` after. Use it for content that depends on
 * the browser (the stored theme, the clipboard), so the first client render matches the HTML.
 */
export function useMounted(): boolean {
  return React.useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  )
}
