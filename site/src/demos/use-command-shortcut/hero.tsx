import * as React from 'react'
import { Button, CommandMenu, Kbd, toast, useCommandShortcut, useModKey, type CommandMenuGroup } from 'ferry-ui'
import { FolderKanban, Receipt, Users } from 'lucide-react'

const GROUPS: CommandMenuGroup[] = [
  {
    id: 'pages',
    label: 'Go to',
    items: [
      { id: 'projects', label: 'Projects', icon: <FolderKanban />, onSelect: () => toast('Projects') },
      { id: 'members', label: 'Members', icon: <Users />, onSelect: () => toast('Members') },
      { id: 'invoices', label: 'Invoices', icon: <Receipt />, onSelect: () => toast('Invoices') },
    ],
  },
]

export default function UseCommandShortcutHero() {
  const [open, setOpen] = React.useState(false)
  const mod = useModKey()
  // The letter J: this site already binds the letter K to its search.
  useCommandShortcut(() => setOpen((current) => !current), 'j')
  return (
    <>
      <Button onClick={() => setOpen(true)}>
        Open the menu <Kbd>{mod} J</Kbd>
      </Button>
      <CommandMenu open={open} onOpenChange={setOpen} groups={GROUPS} />
    </>
  )
}
