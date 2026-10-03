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
} from 'libui'

const SIZES = ['sm', 'md', 'lg', 'xl', 'xxl'] as const

export default function DialogSizes() {
  return (
    <>
      {SIZES.map((size) => (
        <Dialog key={size}>
          <DialogTrigger asChild>
            <Button>{size}</Button>
          </DialogTrigger>
          <DialogContent size={size}>
            <DialogHeader>
              <DialogTitle>Size {size}</DialogTitle>
              <DialogDescription>The panel takes this width on a screen that is wide enough.</DialogDescription>
            </DialogHeader>
            <DialogBody>
              <p className="text-[13px] text-foreground-light">On a phone, the panel takes the width of the screen.</p>
            </DialogBody>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="primary">Done</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      ))}
    </>
  )
}
