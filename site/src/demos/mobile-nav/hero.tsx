import * as React from 'react'
import { Button, MobileNav, MobileNavTrigger, type NavGroup, type NavItem } from 'ferry-ui'
import { CreditCard, FolderKanban, LayoutDashboard, LogOut, Settings, Users } from 'lucide-react'

const MAIN: NavItem[] = [
  { id: 'overview', label: 'Overview', icon: <LayoutDashboard /> },
  { id: 'projects', label: 'Projects', icon: <FolderKanban /> },
  { id: 'members', label: 'Members', icon: <Users /> },
]

const WORKSPACE: NavItem[] = [
  { id: 'billing', label: 'Billing', icon: <CreditCard /> },
  { id: 'settings', label: 'Settings', icon: <Settings /> },
]

export default function MobileNavHero() {
  // A real app reads the current page from its router. This demo keeps it in state.
  const [page, setPage] = React.useState('overview')
  const withState = (item: NavItem): NavItem => ({
    ...item,
    active: item.id === page,
    onSelect: () => setPage(item.id),
  })
  const groups: NavGroup[] = [
    { id: 'main', items: MAIN.map(withState) },
    { id: 'workspace', label: 'Workspace', items: WORKSPACE.map(withState) },
  ]
  const current = [...MAIN, ...WORKSPACE].find((item) => item.id === page)

  return (
    <div className="min-h-dvh bg-background">
      <header className="flex h-12 items-center gap-2 border-b px-2">
        <MobileNav
          // The trigger hides from 768px. `md:inline-flex` keeps it in view for this demo.
          trigger={<MobileNavTrigger className="md:inline-flex" />}
          groups={groups}
          title="Acme"
          description="Billing portal"
          footer={
            <Button className="w-full" icon={<LogOut />}>
              Sign out
            </Button>
          }
        />
        <span className="text-sm font-medium text-foreground">{current?.label}</span>
      </header>
      <p className="p-6 text-[13px] text-foreground-light">Open the navigation with the menu button.</p>
    </div>
  )
}
