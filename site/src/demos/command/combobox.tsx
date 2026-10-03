import * as React from 'react'
import {
  Button,
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from 'ferry-ui'
import { Check, ChevronsUpDown } from 'lucide-react'

const MEMBERS = [
  { id: 'maya', name: 'Maya Chen' },
  { id: 'sam', name: 'Sam Lee' },
  { id: 'ada', name: 'Ada Park' },
  { id: 'liam', name: 'Liam Chen' },
  { id: 'sofia', name: 'Sofia Rossi' },
]

export default function CommandCombobox() {
  const [open, setOpen] = React.useState(false)
  const [owner, setOwner] = React.useState<string>()
  const current = MEMBERS.find((member) => member.id === owner)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button role="combobox" aria-expanded={open} iconRight={<ChevronsUpDown />} className="w-56 justify-between">
          {current?.name ?? 'Select an owner'}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-56 p-0" aria-label="Owner">
        <Command>
          <CommandInput placeholder="Find a member…" />
          <CommandList>
            <CommandEmpty>No member found.</CommandEmpty>
            <CommandGroup heading="Members">
              {MEMBERS.map((member) => (
                <CommandItem
                  key={member.id}
                  value={member.name}
                  onSelect={() => {
                    setOwner(member.id)
                    setOpen(false)
                  }}
                >
                  {member.name}
                  {member.id === owner && <Check className="ml-auto" />}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
