import * as React from 'react'
import {
  DropdownMenuItem,
  ResourceSwitcher,
  ThemeMenu,
  TopBar,
  TopBarLogo,
  TopBarSearch,
  TopBarSegment,
  TopBarSeparator,
  TopBarUserMenu,
  toast,
  type ResourceSwitcherItem,
} from '@roger.b/libui'
import { Building2, FolderKanban } from 'lucide-react'

const PROJECTS: ResourceSwitcherItem[] = [
  { id: 'billing-portal', label: 'Billing portal', icon: <FolderKanban /> },
  { id: 'customer-app', label: 'Customer app', icon: <FolderKanban /> },
  { id: 'status-page', label: 'Status page', icon: <FolderKanban /> },
]

export default function TopBarHero() {
  const [project, setProject] = React.useState('billing-portal')

  // The bar holds no state. A real app opens its phone drawer and its command menu here.
  return (
    <TopBar
      onOpenMobileNav={() => toast('The phone drawer opens here')}
      logo={
        <TopBarLogo label="Acme home">
          <svg viewBox="0 0 20 20" fill="currentColor" className="text-brand">
            <circle cx="10" cy="10" r="8" />
          </svg>
        </TopBarLogo>
      }
      actions={
        <>
          <TopBarSearch onClick={() => toast('The command menu opens here')} />
          <ThemeMenu />
          <TopBarUserMenu name="Maya Chen" description="maya@example.com">
            <DropdownMenuItem>Sign out</DropdownMenuItem>
          </TopBarUserMenu>
        </>
      }
    >
      {/* On a phone, this segment hides together with its separator. A real app gives it an `href`. */}
      <span className="flex min-w-0 items-center gap-0.5 max-sm:hidden">
        <TopBarSeparator />
        <TopBarSegment icon={<Building2 />} chevron={false}>
          Acme
        </TopBarSegment>
      </span>
      <TopBarSeparator />
      <ResourceSwitcher label="switch project" items={PROJECTS} value={project} onValueChange={setProject} />
    </TopBar>
  )
}
