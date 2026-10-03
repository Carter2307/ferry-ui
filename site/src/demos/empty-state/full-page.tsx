import { Button, EmptyState, toast } from 'libui'
import { FileQuestion } from 'lucide-react'

export default function EmptyStateFullPage() {
  return (
    <EmptyState
      variant="bordered"
      size="lg"
      icon={<FileQuestion />}
      title="Page not found"
      description="This page has a new address, or it does not exist."
      actions={
        <>
          <Button onClick={() => toast.info('Back to the last page')}>Go back</Button>
          <Button variant="primary" onClick={() => toast.info('Dashboard opened')}>
            Go to the dashboard
          </Button>
        </>
      }
    />
  )
}
