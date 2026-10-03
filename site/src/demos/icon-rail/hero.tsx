import * as React from 'react'
import { IconRail, type NavGroup, type NavItem } from 'libui'
import { CreditCard, FolderKanban, LayoutDashboard, Settings, Users } from 'lucide-react'

const MAIN: NavItem[] = [
  { id: 'overview', label: 'Overview', icon: <LayoutDashboard /> },
  { id: 'projects', label: 'Projects', icon: <FolderKanban /> },
  { id: 'members', label: 'Members', icon: <Users /> },
]

const WORKSPACE: NavItem[] = [
  { id: 'billing', label: 'Billing', icon: <CreditCard /> },
  { id: 'settings', label: 'Settings', icon: <Settings /> },
]

export default function IconRailHero() {
  // A real app reads the current page from its router. This demo keeps it in state.
  const [page, setPage] = React.useState('overview')
  const withState = (item: NavItem): NavItem => ({
    ...item,
    active: item.id === page,
    onSelect: () => setPage(item.id),
  })
  const groups: NavGroup[] = [
    { id: 'main', items: MAIN.map(withState) },
    { id: 'workspace', items: WORKSPACE.map(withState) },
  ]
  const current = [...MAIN, ...WORKSPACE].find((item) => item.id === page)

  return (
    <div className="flex h-dvh bg-background">
      <IconRail groups={groups} />
      <div className="flex-1 p-6">
        <h1 className="text-lg font-medium text-foreground">{current?.label}</h1>
        <p className="mt-1 text-[13px] text-foreground-light">Select an item of the rail to change the page.</p>
      </div>
    </div>
  )
}
