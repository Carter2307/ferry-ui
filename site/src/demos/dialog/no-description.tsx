import { Button, Dialog, DialogBody, DialogContent, DialogHeader, DialogTitle, DialogTrigger, Kbd, useModKey } from 'ferry-ui'

export default function DialogNoDescription() {
  const mod = useModKey()
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost">Keyboard shortcuts</Button>
      </DialogTrigger>
      <DialogContent size="sm" aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>Keyboard shortcuts</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <p className="flex items-center justify-between text-[13px] text-foreground-light">
            Open the command menu <Kbd>{mod} K</Kbd>
          </p>
          <p className="flex items-center justify-between text-[13px] text-foreground-light">
            Close a dialog <Kbd>Esc</Kbd>
          </p>
        </DialogBody>
      </DialogContent>
    </Dialog>
  )
}
