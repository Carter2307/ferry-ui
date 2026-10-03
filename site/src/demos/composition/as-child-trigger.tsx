import {
  Button,
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Kbd,
} from 'ferry-ui'

export default function AsChildTrigger() {
  return (
    <Dialog>
      {/* The trigger adds its behavior to the Button. The page gets one <button>, not two. */}
      <DialogTrigger asChild>
        <Button>Keyboard shortcuts</Button>
      </DialogTrigger>
      <DialogContent size="sm">
        <DialogHeader>
          <DialogTitle>Keyboard shortcuts</DialogTitle>
          <DialogDescription>These keys work on each page.</DialogDescription>
        </DialogHeader>
        <DialogBody>
          <p className="flex items-center justify-between text-[13px] text-foreground-light">
            Close a dialog <Kbd>Esc</Kbd>
          </p>
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
