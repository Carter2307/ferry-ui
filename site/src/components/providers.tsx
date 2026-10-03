import * as React from 'react'
import {
  DEFAULT_THEME_STORAGE_KEY,
  LinkProvider,
  ThemeProvider,
  Toaster,
  TooltipProvider,
  type LinkComponent,
  type ThemePreference,
} from '@roger.b/libui'
import { Link } from 'react-router'

import { withBase } from '@/config'
import { preloadPath } from '@/lib/nav'

/** Links that leave the app: another site, an anchor of the page. */
const isExternalHref = (href: string) => /^(?:[a-z][a-z0-9+.-]*:|\/\/|#)/i.test(href)
/** Files the server sends as they are (`/llms.txt`, the Markdown version of a page). */
const isFileHref = (href: string) => href.startsWith('/') && /\.(md|txt)$/.test(href)

/**
 * The router adapter: libui components take `href` strings and render them through this link, so
 * a click in the sidebar or in the command menu is a client-side navigation.
 */
const RouterLink: LinkComponent = ({ href, onPointerEnter, ...props }) =>
  isExternalHref(href) || isFileHref(href) ? (
    // A file is not a route: the router does not add the base path of the site to it.
    <a href={isFileHref(href) ? withBase(href) : href} onPointerEnter={onPointerEnter} {...props} />
  ) : (
    <Link
      to={href}
      onPointerEnter={(event) => {
        // The page is likely next: get its chunk while the pointer travels.
        void preloadPath(href.split('#')[0] ?? href)
        onPointerEnter?.(event)
      }}
      {...props}
    />
  )

const isPreference = (value: unknown): value is ThemePreference => value === 'light' || value === 'dark' || value === 'system'

/* -------------------------------------------------------------------------------------------------
 * The stored theme, as a store React can read during hydration.
 * -----------------------------------------------------------------------------------------------*/

const themeListeners = new Set<() => void>()
/** The preference of this visit when the browser refuses storage (private mode). */
let unsavedTheme: ThemePreference = 'system'

function readStoredTheme(): ThemePreference {
  try {
    const stored = window.localStorage.getItem(DEFAULT_THEME_STORAGE_KEY)
    return isPreference(stored) ? stored : unsavedTheme
  } catch {
    return unsavedTheme
  }
}

function writeStoredTheme(next: ThemePreference) {
  unsavedTheme = next
  try {
    window.localStorage.setItem(DEFAULT_THEME_STORAGE_KEY, next)
  } catch {
    // Storage is not available: the choice lasts for this visit.
  }
  for (const listener of themeListeners) listener()
}

function subscribeStoredTheme(listener: () => void) {
  // Another document of the site (a framed demo, another tab) changed the preference.
  const onStorage = (event: StorageEvent) => {
    if (event.key === DEFAULT_THEME_STORAGE_KEY || event.key === null) listener()
  }
  themeListeners.add(listener)
  window.addEventListener('storage', onStorage)
  return () => {
    themeListeners.delete(listener)
    window.removeEventListener('storage', onStorage)
  }
}

/**
 * The theme of the site. The pages are built as static HTML, where the stored preference of the
 * reader is not known: the first render in the browser uses `system`, as the server did, and the
 * stored preference comes right after, before the first paint. (The script in `<head>` already
 * put the right class on `<html>`, so nothing flashes.) A preference that changes in another
 * document of the site, a framed demo or another tab, is followed too.
 */
function SiteTheme({ children }: { children: React.ReactNode }) {
  const theme = React.useSyncExternalStore(subscribeStoredTheme, readStoredTheme, () => 'system' as ThemePreference)
  return (
    <ThemeProvider theme={theme} onThemeChange={writeStoredTheme} storageKey={null}>
      {children}
    </ThemeProvider>
  )
}

/**
 * The providers libui needs, mounted once around the whole site. The `Toaster` is not here: each
 * page mounts {@link SiteToaster}, because a framed example that brings its own must not get two.
 */
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SiteTheme>
      <LinkProvider component={RouterLink}>
        <TooltipProvider>{children}</TooltipProvider>
      </LinkProvider>
    </SiteTheme>
  )
}

/** The outlet of `toast()` for a page of the site. */
export function SiteToaster() {
  return <Toaster />
}

export { RouterLink }
