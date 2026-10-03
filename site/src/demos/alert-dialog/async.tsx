import * as React from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  Button,
  toast,
} from 'libui-kit'

export default function AlertDialogAsync() {
  const [open, setOpen] = React.useState(false)
  const [pending, setPending] = React.useState(false)

  function revoke(event: React.MouseEvent) {
    // Keep the dialog open until the request ends.
    event.preventDefault()
    setPending(true)
    window.setTimeout(() => {
      setPending(false)
      setOpen(false)
      toast.success('API key revoked')
    }, 1200)
  }

  return (
    <AlertDialog
      open={open}
      onOpenChange={(next) => {
        // Escape does not close the dialog while the request runs.
        if (!pending) setOpen(next)
      }}
    >
      <AlertDialogTrigger asChild>
        <Button variant="destructive">Revoke API key</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Revoke this API key?</AlertDialogTitle>
          <AlertDialogDescription>Requests with the key “Analytics export” fail from now on.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={pending}>Cancel</AlertDialogCancel>
          <AlertDialogAction variant="destructive-solid" loading={pending} onClick={revoke}>
            Revoke key
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
