import { Button, ConfirmDialog, toast } from '@roger.b/libui'

export default function ConfirmDialogTyped() {
  return (
    <ConfirmDialog
      trigger={<Button variant="destructive">Delete workspace</Button>}
      title="Delete workspace “acme-marketing”?"
      description="All the projects, members and invoices of this workspace are deleted. You cannot undo this."
      confirmText="acme-marketing"
      confirmLabel="Delete workspace"
      onConfirm={() => {
        toast.success('Workspace deleted')
      }}
    />
  )
}
