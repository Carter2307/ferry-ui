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
} from 'libui-kit'

const FOOTERS = [
  // No class: the footer stacks its buttons.
  { label: 'Stacked buttons', className: undefined },
  // `flex-row justify-end` puts the buttons in one row, at the right.
  { label: 'Buttons in one row', className: 'flex-row justify-end' },
]

export default function SheetFooterLayouts() {
  return (
    <>
      {FOOTERS.map((footer) => (
        <Sheet key={footer.label}>
          <SheetTrigger asChild>
            <Button>{footer.label}</Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Export invoices</SheetTitle>
              <SheetDescription>The export has the invoices of March 2026.</SheetDescription>
            </SheetHeader>
            <SheetBody className="text-[13px] text-foreground-light">You get an email with a link to the CSV file.</SheetBody>
            <SheetFooter className={footer.className}>
              <SheetClose asChild>
                <Button>Cancel</Button>
              </SheetClose>
              <SheetClose asChild>
                <Button variant="primary">Export</Button>
              </SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      ))}
    </>
  )
}
