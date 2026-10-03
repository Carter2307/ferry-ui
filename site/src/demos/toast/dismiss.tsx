import { Button, toast } from '@roger.b/libui'

export default function ToastDismiss() {
  return (
    <>
      <Button onClick={() => toast.info('The import is in progress', { id: 'import', duration: Infinity })}>
        Show a toast that stays
      </Button>
      <Button variant="ghost" onClick={() => toast.dismiss('import')}>
        Dismiss it
      </Button>
      <Button variant="ghost" onClick={() => toast.dismiss()}>
        Dismiss all
      </Button>
    </>
  )
}
