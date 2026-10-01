// Server-safe theme helpers: no React import, so this module never gets the
// `'use client'` directive and `themeInitScript()` can run in a server layout.
import type { ThemePreference } from './theme-provider'

// Same query as ThemeProvider's system listener.
const DARK_QUERY = '(prefers-color-scheme: dark)'

/** localStorage key used by {@link ThemeProvider} and {@link themeInitScript} unless you pass another one. */
export const DEFAULT_THEME_STORAGE_KEY = 'libui-theme'

/**
 * Inline script for <head> that applies the stored theme before first paint, so the
 * page never flashes the wrong theme while React loads. Pass the same `storageKey` and
 * `defaultTheme` as the ThemeProvider. Not needed when the provider uses `storageKey={null}`
 * with a fixed theme, or when the server already renders the right `class` on <html>.
 * `<script dangerouslySetInnerHTML={{ __html: themeInitScript() }} />`
 *
 * Safe to call on the server (React Server Components, SSR layouts): it only builds a string.
 *
 * @param storageKey localStorage key to read (default `libui-theme`).
 * @param defaultTheme Preference applied when nothing is stored (default `system`).
 * @returns The script source, to inline in a `<script>` tag.
 */
export function themeInitScript(storageKey: string = DEFAULT_THEME_STORAGE_KEY, defaultTheme: ThemePreference = 'system'): string {
  return `(function(){var p=${JSON.stringify(defaultTheme)};try{var s=localStorage.getItem(${JSON.stringify(storageKey)});if(s==='light'||s==='dark'||s==='system')p=s}catch(e){}var d=p==='dark'||(p==='system'&&matchMedia('${DARK_QUERY}').matches);var r=document.documentElement;r.classList.toggle('dark',d);r.style.colorScheme=d?'dark':'light'})()`
}
