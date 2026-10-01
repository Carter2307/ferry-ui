/**
 * True on Apple platforms (⌘ vs Ctrl shortcuts). Read once at module load; on a server it describes
 * the server's OS (Node exposes `navigator`), not the visitor's, so in server-rendered markup use the
 * hydration-safe `useIsMac()` hook instead.
 */
export const isMac: boolean =
  typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent)

/**
 * Label of the platform's primary modifier key: "⌘" on Apple platforms, "Ctrl" elsewhere. In
 * server-rendered markup use the hydration-safe `useModKey()` hook instead.
 */
export const modKey: string = isMac ? '⌘' : 'Ctrl'
