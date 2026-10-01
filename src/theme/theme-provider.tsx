import * as React from 'react'

import { DEFAULT_THEME_STORAGE_KEY } from './theme-script'

/** A theme choice as the user makes it: a fixed theme, or `system` to follow the OS setting. */
export type ThemePreference = 'light' | 'dark' | 'system'
/** The theme actually applied to the page (`system` resolved to light or dark). */
export type ResolvedTheme = 'light' | 'dark'

/** What {@link useTheme} returns. */
export interface ThemeContextValue {
  /** The user's preference (may be "system"). Bind theme pickers to this value. */
  theme: ThemePreference
  /** The theme actually applied, with "system" resolved. Branch on this (charts, code highlighting). */
  resolvedTheme: ResolvedTheme
  /** Change (and persist, unless `storageKey` is null) the preference. A no-op outside a ThemeProvider. */
  setTheme: (theme: ThemePreference) => void
}

// Same query as the themeInitScript() snippet.
const DARK_QUERY = '(prefers-color-scheme: dark)'

const ThemeContext = React.createContext<ThemeContextValue | null>(null)

function readStored(key: string): ThemePreference | null {
  try {
    const value = window.localStorage.getItem(key)
    return value === 'light' || value === 'dark' || value === 'system' ? value : null
  } catch {
    return null
  }
}

function subscribeSystem(cb: () => void): () => void {
  const mq = window.matchMedia(DARK_QUERY)
  mq.addEventListener('change', cb)
  return () => mq.removeEventListener('change', cb)
}

const systemIsDark = () => window.matchMedia(DARK_QUERY).matches

/** Watches the `dark` class on <html>, whoever sets it (ThemeProvider, next-themes, Storybook…). */
function subscribeHtmlClass(cb: () => void): () => void {
  const observer = new MutationObserver(cb)
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
  return () => observer.disconnect()
}

const htmlIsDark = () => document.documentElement.classList.contains('dark')

function applyTheme(resolved: ResolvedTheme) {
  const root = document.documentElement
  root.classList.toggle('dark', resolved === 'dark')
  root.style.colorScheme = resolved
}

/** Props of {@link ThemeProvider}. */
export interface ThemeProviderProps {
  /** The app (everything below can call `useTheme()`). */
  children?: React.ReactNode
  /** Preference used when nothing is stored yet (default `system`). Read on mount only. */
  defaultTheme?: ThemePreference
  /** localStorage key the preference is persisted under (default `libui-theme`; `null` disables persistence). */
  storageKey?: string | null
  /** Controlled preference (pair with `onThemeChange`), e.g. when it is saved in the user's account. */
  theme?: ThemePreference
  /** Called with the new preference whenever `setTheme` runs (in both controlled and uncontrolled mode). */
  onThemeChange?: (theme: ThemePreference) => void
}

/**
 * Applies light / dark / system theme by toggling the `dark` class on <html>,
 * persists the preference and exposes it through `useTheme()`.
 * Pair with `themeInitScript()` in <head> to avoid a flash of the wrong theme.
 *
 * Mount it once at the app root; it controls the whole document, so do not nest
 * providers or use it to theme one section (override the CSS variables on a container
 * for that). Skip it if another library already manages the `dark` class — `useTheme()`
 * still reads the class without a provider.
 */
export function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = DEFAULT_THEME_STORAGE_KEY,
  theme: controlledTheme,
  onThemeChange,
}: ThemeProviderProps) {
  const [uncontrolled, setUncontrolled] = React.useState<ThemePreference>(
    () => (storageKey && typeof window !== 'undefined' ? readStored(storageKey) : null) ?? defaultTheme,
  )
  const theme = controlledTheme ?? uncontrolled
  const systemDark = React.useSyncExternalStore(subscribeSystem, systemIsDark, () => false)
  const resolvedTheme: ResolvedTheme = theme === 'system' ? (systemDark ? 'dark' : 'light') : theme

  React.useLayoutEffect(() => {
    applyTheme(resolvedTheme)
  }, [resolvedTheme])

  const setTheme = React.useCallback(
    (next: ThemePreference) => {
      if (controlledTheme === undefined) setUncontrolled(next)
      if (storageKey) {
        try {
          window.localStorage.setItem(storageKey, next)
        } catch {
          /* storage unavailable */
        }
      }
      onThemeChange?.(next)
    },
    [controlledTheme, onThemeChange, storageKey],
  )

  const value = React.useMemo(() => ({ theme, resolvedTheme, setTheme }), [theme, resolvedTheme, setTheme])
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

const noop = () => {}

/**
 * Current theme. Inside a <ThemeProvider> it returns the provider's state;
 * outside one it falls back to reading the `dark` class on <html> (setTheme is a no-op).
 * Use `theme` + `setTheme` for pickers and `resolvedTheme` for code that must adapt to
 * light or dark. Plain styling never needs it: tokens switch automatically.
 */
export function useTheme(): ThemeContextValue {
  const ctx = React.useContext(ThemeContext)
  const htmlDark = React.useSyncExternalStore(subscribeHtmlClass, htmlIsDark, () => false)
  if (ctx) return ctx
  return { theme: 'system', resolvedTheme: htmlDark ? 'dark' : 'light', setTheme: noop }
}
