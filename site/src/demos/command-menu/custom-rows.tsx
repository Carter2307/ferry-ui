import * as React from 'react'
import {
  Avatar,
  AvatarFallback,
  Button,
  CommandGroup,
  CommandItem,
  CommandMenu,
  CommandSeparator,
  toast,
  type CommandMenuGroup,
} from 'libui'
import { FolderKanban } from 'lucide-react'

// In a real app, this item has an `href` or an `onSelect`.
const GROUPS: CommandMenuGroup[] = [
  { id: 'pages', label: 'Go to', items: [{ id: 'projects', label: 'Projects', icon: <FolderKanban /> }] },
]

const MEMBERS = [
  { name: 'Maya Chen', initials: 'MC', email: 'maya@example.com' },
  { name: 'Sam Lee', initials: 'SL', email: 'sam@example.com' },
]

export default function CommandMenuCustomRows() {
  const [open, setOpen] = React.useState(false)

  return (
    <>
      <Button onClick={() => setOpen(true)}>Open the command menu</Button>
      <CommandMenu open={open} onOpenChange={setOpen} groups={GROUPS}>
        <CommandSeparator />
        <CommandGroup heading="Members">
          {MEMBERS.map((member) => (
            <CommandItem
              key={member.email}
              value={`${member.name} ${member.email}`}
              onSelect={() => {
                // A custom row does not close the menu. Close it in your code.
                setOpen(false)
                toast(`${member.name} selected`)
              }}
            >
              <Avatar size="sm">
                <AvatarFallback>{member.initials}</AvatarFallback>
              </Avatar>
              <span className="flex min-w-0 flex-col">
                <span className="truncate text-foreground">{member.name}</span>
                <span className="truncate text-[12px] text-foreground-lighter">{member.email}</span>
              </span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandMenu>
    </>
  )
}
