import * as React from 'react'
import { Button, IconRail, type NavItem } from 'libui-kit'
import { FolderKanban, LayoutDashboard, Users } from 'lucide-react'

const ITEMS: NavItem[] = [
  { id: 'overview', label: 'Overview', icon: <LayoutDashboard />, active: true },
  { id: 'projects', label: 'Projects', icon: <FolderKanban /> },
  { id: 'members', label: 'Members', icon: <Users /> },
]

export default function IconRailControlled() {
  // Your code holds the state. Save it in the storage of your app to keep it between visits.
  const [expanded, setExpanded] = React.useState(true)

  return (
    <div className="flex h-dvh bg-background">
      <IconRail items={ITEMS} expanded={expanded} onExpandedChange={setExpanded} />
      <div className="flex flex-1 flex-col items-start gap-3 p-6">
        <p className="text-[13px] text-foreground-light">The rail is {expanded ? 'expanded' : 'collapsed'}.</p>
        <Button onClick={() => setExpanded((value) => !value)}>{expanded ? 'Collapse the rail' : 'Expand the rail'}</Button>
      </div>
    </div>
  )
}
