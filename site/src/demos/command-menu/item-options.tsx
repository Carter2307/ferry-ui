import * as React from 'react'
import { Badge, Button, CommandMenu, useModKey, type CommandMenuGroup } from '@roger.b/libui'
import { CreditCard, FolderKanban, KeyRound, Plus, Rows3 } from 'lucide-react'

export default function CommandMenuItemOptions() {
  const [open, setOpen] = React.useState(false)
  const [compact, setCompact] = React.useState(false)
  const mod = useModKey()

  const groups: CommandMenuGroup[] = [
    {
      id: 'pages',
      label: 'Go to',
      items: [
        // `keywords`: the query "payment" finds this item.
        { id: 'billing', label: 'Billing', icon: <CreditCard />, hint: 'Plan and invoices', keywords: ['payment'] },
        { id: 'projects', label: 'Projects', icon: <FolderKanban />, badge: <Badge variant="info">New</Badge> },
      ],
    },
    {
      id: 'actions',
      label: 'Actions',
      items: [
        // `shortcut` shows the keys. Your code binds them.
        { id: 'new-project', label: 'New project', icon: <Plus />, shortcut: `${mod} N` },
        {
          id: 'compact',
          label: 'Compact rows',
          icon: <Rows3 />,
          hint: compact ? 'On' : 'Off',
          keepOpen: true,
          onSelect: () => setCompact((value) => !value),
        },
        { id: 'api-key', label: 'New API key', icon: <KeyRound />, hint: 'Admins only', disabled: true },
      ],
    },
  ]

  return (
    <>
      <Button onClick={() => setOpen(true)}>Open the command menu</Button>
      <CommandMenu open={open} onOpenChange={setOpen} groups={groups} />
    </>
  )
}
