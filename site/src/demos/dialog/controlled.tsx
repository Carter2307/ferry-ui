import * as React from 'react'
import {
  Button,
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Field,
  Input,
  toast,
} from 'libui'

export default function DialogControlled() {
  const [open, setOpen] = React.useState(false)

  function invite(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    toast.success('Invitation sent')
    // The form is done: close the dialog from the code.
    setOpen(false)
  }

  return (
    <>
      <Button onClick={() => setOpen(true)}>Invite a member</Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <form onSubmit={invite}>
            <DialogHeader>
              <DialogTitle>Invite a member</DialogTitle>
              <DialogDescription>The member gets an email with a link.</DialogDescription>
            </DialogHeader>
            <DialogBody>
              <Field label="Email">
                <Input type="email" required placeholder="maya@example.com" />
              </Field>
            </DialogBody>
            <DialogFooter>
              <Button onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="submit" variant="primary">
                Send invitation
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
