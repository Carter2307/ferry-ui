import * as React from 'react'
import { Button, CommandMenu, type CommandMenuGroup } from 'libui-kit'
import { CreditCard, FolderKanban, LayoutDashboard, Plus, Search, UserPlus, Users } from 'lucide-react'

export default function CommandMenuHero() {
  const [open, setOpen] = React.useState(false)
  const [last, setLast] = React.useState('none')

  // Navigation first, actions last. In a real app, a navigation item has an `href`.
  const groups: CommandMenuGroup[] = [
    {
      id: 'pages',
      label: 'Go to',
      items: [
        { id: 'overview', label: 'Overview', icon: <LayoutDashboard />, onSelect: () => setLast('Go to Overview') },
        { id: 'projects', label: 'Projects', icon: <FolderKanban />, onSelect: () => setLast('Go to Projects') },
        { id: 'members', label: 'Members', icon: <Users />, onSelect: () => setLast('Go to Members') },
        { id: 'billing', label: 'Billing', icon: <CreditCard />, onSelect: () => setLast('Go to Billing') },
      ],
    },
    {
      id: 'actions',
      label: 'Actions',
      items: [
        { id: 'new-project', label: 'New project', icon: <Plus />, onSelect: () => setLast('New project') },
        { id: 'invite', label: 'Invite member', icon: <UserPlus />, onSelect: () => setLast('Invite member') },
      ],
    },
  ]

  return (
    <div className="flex flex-col items-center gap-3">
      <Button icon={<Search />} onClick={() => setOpen(true)}>
        Open the command menu
      </Button>
      <p className="text-[13px] text-foreground-light">Last command: {last}</p>
      <CommandMenu open={open} onOpenChange={setOpen} groups={groups} />
    </div>
  )
}
