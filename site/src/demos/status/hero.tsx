import { StatusBadge, Table, TableBody, TableCell, TableHead, TableHeader, TableRow, type StatusTone } from '@roger.b/libui'

type InvoiceStatus = 'paid' | 'open' | 'overdue'

// One map from the statuses of your domain to a tone and a label.
const INVOICE_STATUS: Record<InvoiceStatus, { tone: StatusTone; label: string }> = {
  paid: { tone: 'success', label: 'Paid' },
  open: { tone: 'info', label: 'Open' },
  overdue: { tone: 'destructive', label: 'Overdue' },
}

const INVOICES: { number: string; customer: string; status: InvoiceStatus }[] = [
  { number: 'INV-2041', customer: 'Acme', status: 'paid' },
  { number: 'INV-2042', customer: 'Globex', status: 'open' },
  { number: 'INV-2043', customer: 'Northwind Traders', status: 'overdue' },
]

export default function StatusHero() {
  return (
    <Table aria-label="Invoices">
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead>Invoice</TableHead>
          <TableHead>Customer</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {INVOICES.map((invoice) => (
          <TableRow key={invoice.number}>
            <TableCell className="font-mono text-[13px]">{invoice.number}</TableCell>
            <TableCell>{invoice.customer}</TableCell>
            <TableCell>
              <StatusBadge {...INVOICE_STATUS[invoice.status]} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
