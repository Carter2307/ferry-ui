import {
  Button,
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@roger.b/libui'

export default function DialogWithTitle() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Keyboard shortcuts</Button>
      </DialogTrigger>
      {/* No description: tell the dialog that it has none. */}
      <DialogContent size="sm" aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>Keyboard shortcuts</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <p className="text-[13px] text-foreground-light">Press Esc to close a dialog.</p>
        </DialogBody>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="primary">Done</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
