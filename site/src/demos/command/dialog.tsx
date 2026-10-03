import * as React from 'react'
import { Button, CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, toast } from '@roger.b/libui'
import { Users } from 'lucide-react'

const MEMBERS = [
  { name: 'Maya Chen', email: 'maya@example.com' },
  { name: 'Sam Lee', email: 'sam@example.com' },
  { name: 'Ada Park', email: 'ada@example.com' },
  { name: 'Liam Chen', email: 'liam@example.com' },
]

export default function CommandInDialog() {
  const [open, setOpen] = React.useState(false)

  return (
    <>
      <Button icon={<Users />} onClick={() => setOpen(true)}>
        Find a member
      </Button>
      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        title="Find a member"
        description="Search the members of the workspace by name or by email."
      >
        <CommandInput placeholder="Search by name or email…" />
        <CommandList>
          <CommandEmpty>No member found.</CommandEmpty>
          <CommandGroup heading="Members">
            {MEMBERS.map((member) => (
              <CommandItem
                key={member.email}
                value={`${member.name} ${member.email}`}
                onSelect={() => {
                  toast(`Open the profile of ${member.name}`)
                  setOpen(false)
                }}
              >
                {member.name}
                <span className="ml-auto truncate text-xs text-foreground-lighter">{member.email}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  )
}
