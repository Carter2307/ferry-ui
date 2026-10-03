import { MobileNav, MobileNavSection, MobileNavTrigger, type NavItem } from '@roger.b/libui'
import { FolderKanban, LayoutDashboard, Users } from 'lucide-react'

const ITEMS: NavItem[] = [
  { id: 'overview', label: 'Overview', icon: <LayoutDashboard />, active: true },
  { id: 'projects', label: 'Projects', icon: <FolderKanban /> },
  { id: 'members', label: 'Members', icon: <Users /> },
]

export default function MobileNavSections() {
  return (
    <div className="min-h-dvh bg-background">
      <header className="flex h-12 items-center gap-2 border-b px-2">
        <MobileNav
          trigger={<MobileNavTrigger className="md:inline-flex" />}
          items={ITEMS}
          title="Acme"
          showThemeToggle
        >
          <MobileNavSection label="Workspace">
            <span className="px-1 text-sm text-foreground">Acme Europe</span>
            <span className="px-1 text-[13px] text-foreground-light">Pro plan, 12 members</span>
          </MobileNavSection>
        </MobileNav>
        <span className="text-sm font-medium text-foreground">Overview</span>
      </header>
    </div>
  )
}
