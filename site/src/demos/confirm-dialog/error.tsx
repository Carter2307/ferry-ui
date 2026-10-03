import { Button, ConfirmDialog } from '@roger.b/libui'

// Stands for a request that the server refuses.
const wait = (ms: number) => new Promise<void>((resolve) => window.setTimeout(resolve, ms))

export default function ConfirmDialogError() {
  return (
    <ConfirmDialog
      trigger={<Button variant="destructive">Delete team</Button>}
      title="Delete team “Design”?"
      description="The members of the team keep their accounts."
      confirmLabel="Delete team"
      onConfirm={async () => {
        await wait(800)
        throw new Error('This team owns 2 projects. Move them to another team first.')
      }}
    />
  )
}
