import { MobileNav, MobileNavTrigger, type NavItem } from 'libui'
import { FolderKanban, LayoutDashboard, Users } from 'lucide-react'

const ITEMS: NavItem[] = [
  { id: 'overview', label: 'Overview', icon: <LayoutDashboard />, active: true },
  { id: 'projects', label: 'Projects', icon: <FolderKanban /> },
  { id: 'members', label: 'Members', icon: <Users /> },
]

export default function MobileNavRightSide() {
  return (
    <div className="min-h-dvh bg-background">
      <header className="flex h-12 items-center justify-between gap-2 border-b px-3">
        <span className="text-sm font-medium text-foreground">Overview</span>
        <MobileNav
          trigger={<MobileNavTrigger className="md:inline-flex" />}
          items={ITEMS}
          title="Acme"
          side="right"
        />
      </header>
    </div>
  )
}
