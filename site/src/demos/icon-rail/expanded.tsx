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

export default function IconRailExpanded() {
  const [page, setPage] = React.useState('projects')
  const withState = (item: NavItem): NavItem => ({
    ...item,
    active: item.id === page,
    onSelect: () => setPage(item.id),
  })
  const groups: NavGroup[] = [
    { id: 'main', items: MAIN.map(withState) },
    // The label of a group shows as a heading while the rail is expanded.
    { id: 'workspace', label: 'Workspace', items: WORKSPACE.map(withState) },
  ]

  return (
    <div className="flex h-dvh bg-background">
      <IconRail groups={groups} defaultExpanded />
      <div className="flex-1 bg-dot-grid" />
    </div>
  )
}
