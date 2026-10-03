import * as React from 'react'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, toast } from '@roger.b/libui'
import { FileText } from 'lucide-react'

const INVOICES = [
  { id: 'INV-2041', customer: 'Acme', amount: '$4,200.00' },
  { id: 'INV-2042', customer: 'Maya Chen', amount: '$860.00' },
  { id: 'INV-2043', customer: 'Sam Lee', amount: '$12,940.50' },
  { id: 'INV-2044', customer: 'Ada Park', amount: '$1,315.00' },
]

export default function CommandOwnFilter() {
  const [query, setQuery] = React.useState('')
  const text = query.trim().toLowerCase()
  // Your code filters the list. With a search on the server, the results come from the request.
  const results = INVOICES.filter((invoice) => `${invoice.id} ${invoice.customer}`.toLowerCase().includes(text))

  return (
    <Command shouldFilter={false} label="Invoices" className="max-w-md border border-border-strong">
      <CommandInput value={query} onValueChange={setQuery} placeholder="Search by number or customer…" />
      <CommandList>
        <CommandEmpty>No invoice matches “{query}”.</CommandEmpty>
        {results.length > 0 && (
          <CommandGroup heading={`Invoices · ${results.length}`}>
            {results.map((invoice) => (
              <CommandItem key={invoice.id} value={invoice.id} onSelect={() => toast(`Open the invoice ${invoice.id}`)}>
                <FileText />
                <span className="font-mono text-xs text-foreground-lighter">{invoice.id}</span>
                <span className="truncate">{invoice.customer}</span>
                <span className="tabular ml-auto text-xs text-foreground-lighter">{invoice.amount}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        )}
      </CommandList>
    </Command>
  )
}
