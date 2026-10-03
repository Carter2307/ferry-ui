import * as React from 'react'
import { MobileNav, MobileNavTrigger, type NavItem } from 'ferry-ui'
import { FolderKanban, LayoutDashboard, Users } from 'lucide-react'

const PAGES: NavItem[] = [
  { id: 'overview', label: 'Overview', icon: <LayoutDashboard /> },
  { id: 'projects', label: 'Projects', icon: <FolderKanban /> },
  { id: 'members', label: 'Members', icon: <Users /> },
]

export default function MobileNavKeepOpen() {
  const [page, setPage] = React.useState('overview')
  const items = PAGES.map((item) => ({ ...item, active: item.id === page, onSelect: () => setPage(item.id) }))
  const current = PAGES.find((item) => item.id === page)

  return (
    <div className="min-h-dvh bg-background">
      <header className="flex h-12 items-center gap-2 border-b px-2">
        <MobileNav
          trigger={<MobileNavTrigger className="md:inline-flex" />}
          items={items}
          title="Acme"
          closeOnSelect={false}
        />
        <span className="text-sm font-medium text-foreground">{current?.label}</span>
      </header>
    </div>
  )
}
