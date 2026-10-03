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
} from '@roger.b/libui'
import { Send } from 'lucide-react'

export default function AlertDialogPrimaryAction() {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button icon={<Send />}>Send invoice</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Send invoice INV-2041?</AlertDialogTitle>
          <AlertDialogDescription>
            Acme gets the invoice by email. After that, you cannot edit the invoice.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Not yet</AlertDialogCancel>
          {/* No variant: the action keeps the default `primary` look. */}
          <AlertDialogAction onClick={() => toast.success('Invoice sent')}>Send invoice</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
