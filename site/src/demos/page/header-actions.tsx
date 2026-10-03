import { Button, PageHeader } from 'libui-kit'
import { Download, Plus } from 'lucide-react'

export default function PageHeaderActions() {
  return (
    <PageHeader
      title="Invoices"
      description="Each invoice of your customers, newest first."
      actions={
        <>
          <Button icon={<Download />}>Export</Button>
          <Button variant="primary" icon={<Plus />}>
            New invoice
          </Button>
        </>
      }
    />
  )
}
