import { StatusBadge, Table, TableBody, TableCell, TableHead, TableHeader, TableRow, type StatusTone } from 'libui-kit'

type InvoiceStatus = 'paid' | 'open' | 'overdue'

const STATUS: Record<InvoiceStatus, { tone: StatusTone; label: string }> = {
  paid: { tone: 'success', label: 'Paid' },
  open: { tone: 'info', label: 'Open' },
  overdue: { tone: 'destructive', label: 'Overdue' },
}

const INVOICES: { number: string; customer: string; status: InvoiceStatus; amount: string }[] = [
  { number: 'INV-2041', customer: 'Northwind Traders', status: 'paid', amount: '$1,250.00' },
  { number: 'INV-2042', customer: 'Acme', status: 'open', amount: '$3,480.00' },
  { number: 'INV-2043', customer: 'Globex', status: 'overdue', amount: '$920.50' },
  { number: 'INV-2044', customer: 'Initech', status: 'paid', amount: '$415.00' },
]

export default function TableHero() {
  return (
    <Table aria-label="Invoices">
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead>Invoice</TableHead>
          <TableHead>Customer</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {INVOICES.map((invoice) => (
          <TableRow key={invoice.number}>
            <TableCell className="font-mono text-[13px]">{invoice.number}</TableCell>
            <TableCell>{invoice.customer}</TableCell>
            <TableCell>
              <StatusBadge {...STATUS[invoice.status]} />
            </TableCell>
            <TableCell className="text-right tabular">{invoice.amount}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
