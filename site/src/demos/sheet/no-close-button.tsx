import {
  Button,
  Sheet,
  SheetBody,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from 'ferry-ui'

export default function SheetNoCloseButton() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button>Read the terms</Button>
      </SheetTrigger>
      <SheetContent showCloseButton={false}>
        <SheetHeader>
          <SheetTitle>Terms of service</SheetTitle>
          <SheetDescription>The version of March 2026.</SheetDescription>
        </SheetHeader>
        <SheetBody className="text-[13px] text-foreground-light">
          <p>Each member of the workspace must accept the terms before the first invoice.</p>
          <p>An admin can read the accepted version in the settings of the workspace.</p>
        </SheetBody>
        {/* The panel has no close button: the footer gives the way out. */}
        <SheetFooter>
          <SheetClose asChild>
            <Button variant="primary">Done</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
