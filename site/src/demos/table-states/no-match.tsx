import * as React from 'react'
import {
  Button,
  SearchInput,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableMessageRow,
  TableRow,
} from '@roger.b/libui'
import { X } from 'lucide-react'

const CUSTOMERS = [
  { name: 'Acme', plan: 'Pro' },
  { name: 'Maya Chen', plan: 'Free' },
  { name: 'Jonas Weber', plan: 'Enterprise' },
]

export default function TableStatesNoMatch() {
  const [query, setQuery] = React.useState('orders')
  const rows = CUSTOMERS.filter((customer) => customer.name.toLowerCase().includes(query.trim().toLowerCase()))

  return (
    <div className="flex flex-col gap-4">
      <SearchInput placeholder="Search customers" value={query} onValueChange={setQuery} />
      <Table aria-label="Customers">
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead>Customer</TableHead>
            <TableHead>Plan</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.length === 0 ? (
            <TableMessageRow colSpan={2}>
              <div className="flex flex-col items-center gap-2">
                <span>No customers match “{query}”.</span>
                <Button size="tiny" icon={<X />} onClick={() => setQuery('')}>
                  Clear search
                </Button>
              </div>
            </TableMessageRow>
          ) : (
            rows.map((customer) => (
              <TableRow key={customer.name}>
                <TableCell>{customer.name}</TableCell>
                <TableCell className="text-foreground-light">{customer.plan}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
