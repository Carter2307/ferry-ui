import { Button, ConfirmDialog, toast } from '@roger.b/libui'
import { KeyRound } from 'lucide-react'

// Stands for a request to your server.
const wait = (ms: number) => new Promise<void>((resolve) => window.setTimeout(resolve, ms))

export default function ConfirmDialogPending() {
  return (
    <ConfirmDialog
      trigger={
        <Button variant="destructive" icon={<KeyRound />}>
          Revoke key
        </Button>
      }
      title="Revoke API key “Analytics export”?"
      description="Requests that use this key start to fail immediately."
      confirmLabel="Revoke key"
      onConfirm={async () => {
        await wait(1500)
        toast.success('API key revoked')
      }}
    />
  )
}
