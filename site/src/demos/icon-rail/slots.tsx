import * as React from 'react'
import { IconRail, IconRailItem, useIconRail, type NavItem } from 'libui'
import { FolderKanban, Keyboard, LayoutDashboard, LifeBuoy, Users } from 'lucide-react'

const ITEMS: NavItem[] = [
  { id: 'overview', label: 'Overview', icon: <LayoutDashboard />, active: true },
  { id: 'projects', label: 'Projects', icon: <FolderKanban /> },
  { id: 'members', label: 'Members', icon: <Users /> },
]

/** A square mark. It shows the name of the product when the rail is expanded. */
function Wordmark() {
  const rail = useIconRail()
  return (
    <span className="flex h-9 items-center gap-2 px-[9px] text-sm font-medium text-foreground">
      <span className="size-[18px] shrink-0 rounded-sm bg-brand" aria-hidden="true" />
      {rail?.expanded && 'Acme'}
    </span>
  )
}

export default function IconRailSlots() {
  const [message, setMessage] = React.useState('Select an item of the footer.')

  return (
    <div className="flex h-dvh bg-background">
      <IconRail
        items={ITEMS}
        defaultExpanded
        logo={<Wordmark />}
        footer={
          <>
            <IconRailItem
              item={{ id: 'help', label: 'Help center', icon: <LifeBuoy />, onSelect: () => setMessage('Help center') }}
            />
            <IconRailItem
              item={{ id: 'shortcuts', label: 'Shortcuts', icon: <Keyboard />, onSelect: () => setMessage('Shortcuts') }}
            />
          </>
        }
      />
      <p className="flex-1 p-6 text-[13px] text-foreground-light">{message}</p>
    </div>
  )
}
