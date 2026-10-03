import { Button, ConfirmDialog, toast } from 'libui'

export default function ConfirmDialogTones() {
  return (
    <>
      <ConfirmDialog
        tone="destructive"
        trigger={<Button variant="destructive">Remove member</Button>}
        title="Remove Sam Lee from the team?"
        description="Sam loses access to all the projects of the team."
        confirmLabel="Remove member"
        onConfirm={() => {
          toast.success('Member removed')
        }}
      />
      <ConfirmDialog
        tone="warning"
        trigger={<Button>Pause subscription</Button>}
        title="Pause your subscription?"
        description="Your team keeps read-only access to each project until you resume."
        confirmLabel="Pause subscription"
        cancelLabel="Keep subscription"
        onConfirm={() => {
          toast.success('Subscription paused')
        }}
      />
      <ConfirmDialog
        tone="primary"
        trigger={<Button>Send invoice</Button>}
        title="Send invoice INV-2041?"
        description="The customer gets the invoice by email. After that, you cannot edit it."
        confirmLabel="Send invoice"
        cancelLabel="Not yet"
        onConfirm={() => {
          toast.success('Invoice sent')
        }}
      />
    </>
  )
}
