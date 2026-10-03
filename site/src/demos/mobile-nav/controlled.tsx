import * as React from 'react'
import { Button, MobileNav, type NavItem } from 'libui-kit'
import { FolderKanban, LayoutDashboard, Users } from 'lucide-react'

const ITEMS: NavItem[] = [
  { id: 'overview', label: 'Overview', icon: <LayoutDashboard />, active: true },
  { id: 'projects', label: 'Projects', icon: <FolderKanban /> },
  { id: 'members', label: 'Members', icon: <Users /> },
]

export default function MobileNavControlled() {
  const [open, setOpen] = React.useState(false)

  return (
    <div className="flex min-h-dvh flex-col items-start gap-3 bg-background p-6">
      <Button onClick={() => setOpen(true)}>Open the navigation</Button>
      <p className="text-[13px] text-foreground-light">The drawer is {open ? 'open' : 'closed'}.</p>
      <MobileNav open={open} onOpenChange={setOpen} items={ITEMS} title="Acme" />
    </div>
  )
}
