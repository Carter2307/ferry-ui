import * as React from 'react'
import { Button, EmptyState, SearchInput } from '@roger.b/libui'
import { SearchX } from 'lucide-react'

const CUSTOMERS = ['Acme', 'Globex', 'Northwind Traders']

export default function EmptyStateNoResults() {
  const [query, setQuery] = React.useState('payroll')
  const matches = CUSTOMERS.filter((name) => name.toLowerCase().includes(query.trim().toLowerCase()))

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-4">
      <SearchInput placeholder="Search customers" value={query} onValueChange={setQuery} className="w-full" />
      {matches.length === 0 ? (
        <EmptyState
          icon={<SearchX />}
          title={`No results for "${query}"`}
          description="Check the spelling or search for another name."
          actions={<Button onClick={() => setQuery('')}>Clear search</Button>}
        />
      ) : (
        <ul className="divide-y rounded-lg border bg-surface-100 text-sm text-foreground">
          {matches.map((name) => (
            <li key={name} className="px-4 py-2.5">
              {name}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
