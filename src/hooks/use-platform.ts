import * as React from 'react'

import { isMac } from '../lib/platform'

// The platform never changes while the page is open: nothing to subscribe to.
const subscribe = () => () => {}
const getSnapshot = () => isMac
// The server cannot know the visitor's platform: render the non-Apple variant, like any
// client whose platform is unknown, then switch after hydration on Apple devices.
const getServerSnapshot = () => false

/**
 * Hydration-safe `isMac` (from `lib/platform`): `true` on Apple platforms (⌘ shortcuts), `false`
 * elsewhere.
 *
 * Use it instead of the `isMac` constant in anything rendered on the server (SSR / static
 * generation): the server and the first client render both see `false`, then React re-renders
 * with the real platform, so the markup never mismatches. In client-only code (event handlers,
 * Storybook stories, SPAs) the constant is fine.
 */
export function useIsMac(): boolean {
  return React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}

/**
 * Hydration-safe `modKey` (from `lib/platform`): the label of the platform's primary modifier key,
 * `"⌘"` on Apple platforms and `"Ctrl"` elsewhere (`"Ctrl"` on the server and during hydration).
 *
 * Use it for keyboard hints rendered by components (`<Kbd>{modKey} K</Kbd>`); see
 * {@link useIsMac} for why.
 */
export function useModKey(): string {
  return useIsMac() ? '⌘' : 'Ctrl'
}
