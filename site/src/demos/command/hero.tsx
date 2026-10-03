import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
  toast,
  useModKey,
} from 'ferry-ui'
import { FolderKanban, Plus, Settings, UserPlus } from 'lucide-react'

export default function CommandHero() {
  const mod = useModKey()
  return (
    <Command label="Commands" className="max-w-md border border-border-strong">
      <CommandInput placeholder="Type a command or search…" />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Projects">
          <CommandItem onSelect={() => toast('Open the project Billing portal')}>
            <FolderKanban /> Billing portal
          </CommandItem>
          <CommandItem onSelect={() => toast('Open the project Customer dashboard')}>
            <FolderKanban /> Customer dashboard
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Actions">
          <CommandItem onSelect={() => toast('New project')}>
            <Plus /> New project
            <CommandShortcut>{mod} N</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={() => toast('Invite a member')}>
            <UserPlus /> Invite a member
            <CommandShortcut>{mod} I</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={() => toast('Open the settings')}>
            <Settings /> Open settings
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  )
}
