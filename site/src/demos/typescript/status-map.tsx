import { StatusBadge, type StatusTone } from 'libui'

type InvoiceStatus = 'paid' | 'open' | 'overdue'

// TypeScript refuses a tone that libui does not have, and a status with no entry.
const INVOICE_STATUS: Record<InvoiceStatus, { tone: StatusTone; label: string }> = {
  paid: { tone: 'success', label: 'Paid' },
  open: { tone: 'info', label: 'Open' },
  overdue: { tone: 'destructive', label: 'Overdue' },
}

const STATUSES: InvoiceStatus[] = ['paid', 'open', 'overdue']

export default function StatusMap() {
  return (
    <>
      {STATUSES.map((status) => (
        <StatusBadge key={status} {...INVOICE_STATUS[status]} />
      ))}
    </>
  )
}
