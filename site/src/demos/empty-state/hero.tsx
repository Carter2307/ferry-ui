import { Button, EmptyState, toast } from 'ferry-ui'
import { Plus, Receipt } from 'lucide-react'

export default function EmptyStateHero() {
  return (
    <EmptyState
      icon={<Receipt />}
      title="No invoices yet"
      description="The invoices that you send to your customers show here."
      actions={
        <Button variant="primary" icon={<Plus />} onClick={() => toast.success('Invoice created')}>
          New invoice
        </Button>
      }
    />
  )
}
