import * as React from 'react'
import {
  AppShell,
  CommandMenu,
  DropdownMenuItem,
  IconRail,
  MobileNav,
  PageContainer,
  PageHeader,
  PageSection,
  ThemeMenu,
  TopBar,
  TopBarLogo,
  TopBarSearch,
  TopBarSegment,
  TopBarSeparator,
  TopBarUserMenu,
  type NavGroup,
} from '@roger.b/libui'
import { CreditCard, FolderKanban, LayoutDashboard, Settings, Users } from 'lucide-react'

const PAGES = [
  { id: 'overview', label: 'Overview', icon: <LayoutDashboard /> },
  { id: 'projects', label: 'Projects', icon: <FolderKanban /> },
  { id: 'members', label: 'Members', icon: <Users /> },
  { id: 'billing', label: 'Billing', icon: <CreditCard /> },
  { id: 'settings', label: 'Settings', icon: <Settings /> },
]

export default function AppShellBasic() {
  // A real app reads the current page from its router. This demo keeps it in state.
  const [page, setPage] = React.useState('overview')
  const [navOpen, setNavOpen] = React.useState(false)
  const [commandOpen, setCommandOpen] = React.useState(false)
  const current = PAGES.find((entry) => entry.id === page) ?? PAGES[0]

  // One definition of the navigation for the rail, the phone drawer and the command menu.
  const groups: NavGroup[] = [
    {
      id: 'main',
      items: PAGES.map((entry) => ({ ...entry, active: entry.id === page, onSelect: () => setPage(entry.id) })),
    },
  ]

  return (
    <>
      <AppShell
        scrollKey={page}
        mobileNavOpen={navOpen}
        onMobileNavOpenChange={setNavOpen}
        onCommandShortcut={() => setCommandOpen((open) => !open)}
        topBar={
          <TopBar
            onOpenMobileNav={() => setNavOpen(true)}
            logo={
              <TopBarLogo label="Acme home">
                <svg viewBox="0 0 20 20" fill="currentColor" className="text-brand">
                  <circle cx="10" cy="10" r="8" />
                </svg>
              </TopBarLogo>
            }
            actions={
              <>
                <TopBarSearch onClick={() => setCommandOpen(true)} />
                <ThemeMenu />
                <TopBarUserMenu name="Maya Chen" description="maya@example.com">
                  <DropdownMenuItem>Sign out</DropdownMenuItem>
                </TopBarUserMenu>
              </>
            }
          >
            <TopBarSeparator />
            <TopBarSegment chevron={false}>Acme</TopBarSegment>
          </TopBar>
        }
        rail={<IconRail groups={groups} />}
        mobileNav={<MobileNav groups={groups} title="Acme" showThemeToggle />}
      >
        <PageContainer>
          <PageHeader title={current?.label} description="The page scrolls. The top bar and the rail stay in place." />
          <PageSection title="Content">
            <div className="h-[40rem] rounded-lg border border-dashed border-border-stronger bg-surface-75" />
          </PageSection>
        </PageContainer>
      </AppShell>
      <CommandMenu open={commandOpen} onOpenChange={setCommandOpen} groups={groups} />
    </>
  )
}
