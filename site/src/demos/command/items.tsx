import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, toast } from 'ferry-ui'
import { CreditCard, KeyRound, LayoutDashboard, Users } from 'lucide-react'

export default function CommandItems() {
  return (
    <Command label="Pages" className="max-w-sm border border-border-strong">
      <CommandInput placeholder="Go to a page…" />
      <CommandList>
        <CommandEmpty>No page found.</CommandEmpty>
        <CommandGroup heading="Go to">
          <CommandItem onSelect={() => toast('Open the dashboard')}>
            <LayoutDashboard /> Dashboard
          </CommandItem>
          {/* `keywords`: the search for "invoices" also finds this item. */}
          <CommandItem keywords={['invoices', 'payment', 'plan']} onSelect={() => toast('Open the billing page')}>
            <CreditCard /> Billing
          </CommandItem>
          {/* `value`: the search reads this text, not the content with the count. */}
          <CommandItem value="Members" onSelect={() => toast('Open the members page')}>
            <Users /> Members
            <span className="ml-auto text-xs text-foreground-lighter">12</span>
          </CommandItem>
          <CommandItem disabled>
            <KeyRound /> API keys
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  )
}
