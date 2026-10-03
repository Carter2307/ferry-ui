import { Button, ConfirmDialog, toast } from 'libui'
import { Trash2 } from 'lucide-react'

export default function ConfirmDialogHero() {
  return (
    <ConfirmDialog
      trigger={
        <Button variant="destructive" icon={<Trash2 />}>
          Delete project
        </Button>
      }
      title="Delete project “Billing portal”?"
      description="The project, its invoices and its API keys are deleted. You cannot undo this."
      confirmLabel="Delete project"
      onConfirm={() => {
        toast.success('Project deleted')
      }}
    />
  )
}
