import * as React from 'react'

import { useCommandShortcut } from '../../hooks/use-command-shortcut'
import { cn } from '../../lib/utils'

/* -------------------------------------------------------------------------------------------------
 * Context
 * -----------------------------------------------------------------------------------------------*/

/** State an {@link AppShell} shares with the components rendered inside it. */
export interface AppShellContextValue {
  /** Whether the mobile navigation drawer is open. */
  mobileNavOpen: boolean
  /** Opens or closes the mobile navigation drawer. */
  setMobileNavOpen: (open: boolean) => void
  /** Id of the `<main>` element (target of the skip link). */
  mainId: string
}

const AppShellContext = React.createContext<AppShellContextValue | null>(null)

/**
 * Reads the state of the nearest {@link AppShell}: the mobile navigation drawer (`mobileNavOpen`,
 * `setMobileNavOpen`) and the id of the main region. Returns `null` outside an AppShell.
 *
 * Use it to build your own drawer trigger (e.g. inside a custom top bar). `MobileNav` and
 * `MobileNavTrigger` already use it, so you rarely need it directly.
 */
export function useAppShell(): AppShellContextValue | null {
  return React.useContext(AppShellContext)
}

/* -------------------------------------------------------------------------------------------------
 * AppShell
 * -----------------------------------------------------------------------------------------------*/

/** Props of {@link AppShell}. */
export interface AppShellProps extends Omit<React.ComponentProps<'div'>, 'children'> {
  /**
   * The page content, rendered in the scrollable `<main>` region (render your router outlet here).
   * Pages lay themselves out: the region is a flex column with no padding.
   */
  children?: React.ReactNode
  /**
   * Desktop side navigation, usually an `IconRail`. It is shown from the `md` breakpoint (768px)
   * and hidden on phones, where `mobileNav` takes over.
   */
  rail?: React.ReactNode
  /**
   * Full-width bar above the rail and the main region, usually a 48px `<header>` or the library's
   * TopBar. Put a `MobileNavTrigger` in it so phones can open the drawer, or, for a bar that takes
   * an open callback (TopBar's `onOpenMobileNav`), control the drawer with `mobileNavOpen`.
   */
  topBar?: React.ReactNode
  /**
   * Phone navigation drawer, usually a `MobileNav`. A `MobileNav` rendered here (or anywhere inside
   * the shell) binds itself to the shell's drawer state, so you do not need to pass `open`.
   */
  mobileNav?: React.ReactNode
  /**
   * Controlled open state of the mobile navigation drawer. Pair with `onMobileNavOpenChange`. Use it
   * when something outside the shell opens the drawer (e.g. a top bar's menu callback).
   */
  mobileNavOpen?: boolean
  /** Initial open state of the mobile navigation drawer when uncontrolled. Defaults to `false`. */
  defaultMobileNavOpen?: boolean
  /** Called when the mobile navigation drawer opens or closes. */
  onMobileNavOpenChange?: (open: boolean) => void
  /**
   * Called on ⌘K / Ctrl+K anywhere in the app, typically to toggle a command palette. Omit it to
   * leave the shortcut unbound. See `useCommandShortcut` to bind it elsewhere.
   */
  onCommandShortcut?: () => void
  /**
   * When this value changes, the main region scrolls back to the top. Pass the current pathname
   * so each new page starts at the top, as full page loads do.
   */
  scrollKey?: string | number
  /** Id of the `<main>` element targeted by the skip link. Defaults to a unique generated id. */
  mainId?: string
  /** Extra classes for the `<main>` region (e.g. a page background). */
  mainClassName?: string
  /** Text of the keyboard-only "skip to content" link. Defaults to `"Skip to content"`. */
  skipLinkLabel?: string
}

/**
 * The application frame: a full-viewport column with an optional top bar, a desktop side rail, a
 * scrollable `<main>` region for the page, a phone navigation drawer and a keyboard-only skip link.
 * Only `<main>` scrolls; the top bar and the rail stay in place.
 *
 * Use it once, at the root of the signed-in part of an app, and compose it from slots:
 * `rail={<IconRail … />}`, `topBar={<header>…<MobileNavTrigger /></header>}`,
 * `mobileNav={<MobileNav … />}`, and the page as `children`. It fetches nothing and knows no router:
 * pass `scrollKey` (the pathname) to reset scrolling between pages. Do NOT nest AppShells or use it
 * for a section inside a page (use a plain flex layout), nor for marketing / auth pages that have
 * no persistent navigation.
 */
export function AppShell({
  children,
  rail,
  topBar,
  mobileNav,
  mobileNavOpen: mobileNavOpenProp,
  defaultMobileNavOpen = false,
  onMobileNavOpenChange,
  onCommandShortcut,
  scrollKey,
  mainId: mainIdProp,
  mainClassName,
  skipLinkLabel = 'Skip to content',
  className,
  ...props
}: AppShellProps) {
  const generatedId = React.useId()
  const mainId = mainIdProp ?? `main-${generatedId.replace(/[^a-zA-Z0-9_-]/g, '')}`
  const mainRef = React.useRef<HTMLElement | null>(null)

  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultMobileNavOpen)
  const mobileNavOpen = mobileNavOpenProp ?? uncontrolledOpen
  const isControlled = mobileNavOpenProp !== undefined
  const setMobileNavOpen = React.useCallback(
    (open: boolean) => {
      if (!isControlled) setUncontrolledOpen(open)
      onMobileNavOpenChange?.(open)
    },
    [isControlled, onMobileNavOpenChange],
  )

  useCommandShortcut(() => onCommandShortcut?.(), { enabled: onCommandShortcut !== undefined })

  // New page: scroll the content back to the top.
  React.useEffect(() => {
    if (mainRef.current) mainRef.current.scrollTop = 0
  }, [scrollKey])

  const context = React.useMemo(
    () => ({ mobileNavOpen, setMobileNavOpen, mainId }),
    [mobileNavOpen, setMobileNavOpen, mainId],
  )

  return (
    <AppShellContext.Provider value={context}>
      <div
        data-slot="app-shell"
        className={cn('relative flex h-dvh flex-col overflow-hidden bg-background', className)}
        {...props}
      >
        <a
          href={`#${mainId}`}
          data-slot="app-shell-skip-link"
          // The box styles live in the `focus:` variant: `not-sr-only` resets the padding to 0.
          className="sr-only z-50 rounded-md bg-surface-300 text-sm text-foreground outline-none focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:border focus:border-border-strong focus:px-3 focus:py-2 focus:shadow-overlay focus:ring-2 focus:ring-ring"
        >
          {skipLinkLabel}
        </a>
        {topBar}
        <div data-slot="app-shell-body" className="flex min-h-0 flex-1">
          {rail != null && (
            <div data-slot="app-shell-rail" className="hidden shrink-0 md:flex">
              {rail}
            </div>
          )}
          <main
            id={mainId}
            ref={mainRef}
            tabIndex={-1}
            data-slot="app-shell-main"
            className={cn(
              'relative flex min-h-0 min-w-0 flex-1 flex-col overflow-y-auto outline-none',
              mainClassName,
            )}
          >
            {children}
          </main>
        </div>
        {mobileNav}
      </div>
    </AppShellContext.Provider>
  )
}
