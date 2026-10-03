import { Button, toast } from 'ferry-ui'

export default function ToastDescription() {
  return (
    <Button
      onClick={() =>
        toast.success('Invoice sent', {
          description: 'The customer gets INV-2041 at billing@example.com.',
        })
      }
    >
      Send invoice
    </Button>
  )
}
