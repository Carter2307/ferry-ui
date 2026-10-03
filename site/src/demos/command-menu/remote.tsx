import * as React from 'react'
import { Button, CommandMenu, type CommandMenuGroup } from 'libui-kit'
import { FileText } from 'lucide-react'

const INVOICES = [
  { id: 'INV-2041', customer: 'Northwind Trading', amount: '$4,200.00' },
  { id: 'INV-2042', customer: 'Acme', amount: '$860.00' },
  { id: 'INV-2043', customer: 'Globex Logistics', amount: '$12,940.50' },
  { id: 'INV-2044', customer: 'Umbrella Health', amount: '$7,020.00' },
]

export default function CommandMenuRemote() {
  const [open, setOpen] = React.useState(false)
  const [results, setResults] = React.useState(INVOICES)
  const [loading, setLoading] = React.useState(false)
  const timer = React.useRef<number | undefined>(undefined)

  // A timer plays the role of the server. The menu calls this function with "" each time it opens.
  const search = (query: string) => {
    window.clearTimeout(timer.current)
    setLoading(true)
    timer.current = window.setTimeout(() => {
      const text = query.trim().toLowerCase()
      setResults(INVOICES.filter((invoice) => `${invoice.id} ${invoice.customer}`.toLowerCase().includes(text)))
      setLoading(false)
    }, 500)
  }

  const groups: CommandMenuGroup[] = [
    {
      id: 'invoices',
      label: 'Invoices',
      items: results.map((invoice) => ({
        id: invoice.id,
        label: `${invoice.id} · ${invoice.customer}`,
        icon: <FileText />,
        hint: invoice.amount,
      })),
    },
  ]

  return (
    <>
      <Button onClick={() => setOpen(true)}>Search invoices</Button>
      <CommandMenu
        open={open}
        onOpenChange={setOpen}
        groups={groups}
        shouldFilter={false}
        onSearchChange={search}
        loading={loading}
        loadingMessage="Search in progress…"
        emptyMessage="No invoice matches."
        placeholder="Search invoices by number or customer…"
      />
    </>
  )
}
