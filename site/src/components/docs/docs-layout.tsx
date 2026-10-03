import * as React from 'react'
import {
  AppShell,
  Badge,
  InnerMenu,
  MobileNav,
  ThemeMenu,
  TopBar,
  TopBarIconButton,
  TopBarLogo,
  TopBarSearch,
  TopBarSegment,
  TopBarSeparator,
  type NavGroup,
} from 'ferry-ui'
import { Outlet, useLocation } from 'react-router'

import { GithubIcon, LogoMark } from '@/components/logo'
import { SiteToaster } from '@/components/providers'
import { SiteSearch } from '@/components/site-search'
import { DOCS_HOME, GITHUB_URL, VERSION } from '@/config'
import { normalizePath, pagesByGroup } from '@/lib/nav'
import { useMounted } from '@/lib/use-mounted'

/** The sidebar: one group per section, the open page marked as current. */
function useNavGroups(pathname: string): NavGroup[] {
  return React.useMemo(
    () =>
      pagesByGroup.map(({ group, pages }) => ({
        id: group,
        label: group,
        items: pages.map((page) => ({ id: page.path, label: page.title, href: page.path, active: page.path === pathname })),
      })),
    [pathname],
  )
}

/**
 * The frame of the documentation, built with ferry-ui's own application shell: `TopBar`, `InnerMenu`
 * as the sidebar, `MobileNav` on phones and `CommandMenu` as the search (see site-search.tsx).
 */
export function DocsLayout() {
  const pathname = normalizePath(useLocation().pathname)
  const { hash } = useLocation()
  const groups = useNavGroups(pathname)
  const [navOpen, setNavOpen] = React.useState(false)
  const [searchOpen, setSearchOpen] = React.useState(false)
  const scroller = React.useRef<HTMLDivElement>(null)
  const mounted = useMounted()

  // A new page starts at the top, or at the section its link names.
  React.useEffect(() => {
    const target = hash ? document.getElementById(decodeURIComponent(hash.slice(1))) : null
    if (target) target.scrollIntoView()
    else scroller.current?.scrollTo({ top: 0 })
  }, [pathname, hash])

  // The current page stays visible in the sidebar.
  React.useEffect(() => {
    document.querySelector('[data-slot="inner-menu"] [aria-current="page"]')?.scrollIntoView({ block: 'nearest' })
  }, [pathname])

  return (
    <>
      <AppShell
        mobileNavOpen={navOpen}
        onMobileNavOpenChange={setNavOpen}
        onCommandShortcut={() => setSearchOpen((open) => !open)}
        topBar={
          <TopBar
            onOpenMobileNav={() => setNavOpen(true)}
            navLabel="Site"
            logo={
              <TopBarLogo href="/" label="ferry-ui home">
                <LogoMark />
              </TopBarLogo>
            }
            actions={
              <>
                <TopBarSearch onClick={() => setSearchOpen(true)} label="Search the documentation" />
                <TopBarIconButton icon={<GithubIcon />} label="GitHub" href={GITHUB_URL} external className="max-sm:hidden" />
                {/* The icon shows the stored preference, which the server does not know. */}
                {mounted ? <ThemeMenu /> : <span className="size-8" aria-hidden="true" />}
              </>
            }
          >
            <TopBarSeparator />
            <TopBarSegment href="/">ferry-ui</TopBarSegment>
            <TopBarSeparator />
            <TopBarSegment href={DOCS_HOME} current badge={<Badge font="mono" case="normal">{`v${VERSION}`}</Badge>}>
              Docs
            </TopBarSegment>
          </TopBar>
        }
        mobileNav={<MobileNav groups={groups} title="ferry-ui" description="Documentation" showThemeToggle />}
      >
        <div className="flex min-h-0 flex-1 flex-col md:flex-row">
          <InnerMenu groups={groups} label="Documentation" mobileTabs={false} className="hidden md:flex" />
          <div ref={scroller} data-slot="docs-scroller" className="min-w-0 flex-1 overflow-y-auto scroll-smooth">
            <Outlet />
          </div>
        </div>
      </AppShell>
      <SiteSearch open={searchOpen} onOpenChange={setSearchOpen} />
      <SiteToaster />
    </>
  )
}
