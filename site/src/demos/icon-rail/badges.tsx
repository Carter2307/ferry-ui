import { Badge, IconRail, type NavItem } from 'libui-kit'
import { CreditCard, FolderKanban, Inbox, LayoutDashboard } from 'lucide-react'

const ITEMS: NavItem[] = [
  { id: 'overview', label: 'Overview', icon: <LayoutDashboard />, active: true },
  {
    id: 'inbox',
    label: 'Inbox',
    icon: <Inbox />,
    badge: (
      <Badge variant="primary" font="mono">
        12
      </Badge>
    ),
  },
  { id: 'projects', label: 'Projects', icon: <FolderKanban /> },
  { id: 'billing', label: 'Billing', icon: <CreditCard />, disabled: true },
]

export default function IconRailBadges() {
  return (
    <div className="flex h-dvh bg-background">
      {/* Two rails on one page: each one needs its own name. */}
      <IconRail items={ITEMS} collapsible={false} aria-label="Collapsed rail" />
      <IconRail items={ITEMS} collapsible={false} defaultExpanded aria-label="Expanded rail" />
      <div className="flex-1 bg-dot-grid" />
    </div>
  )
}
