import * as React from 'react'
import {
  Button,
  Checkbox,
  Label,
  Sheet,
  SheetBody,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  toast,
} from '@roger.b/libui'
import { ListFilter } from 'lucide-react'

const STATUSES = ['Paid', 'Open', 'Overdue']

export default function SheetControlled() {
  const [open, setOpen] = React.useState(false)

  function apply() {
    toast.success('Filters applied')
    // The work is done: close the sheet from the code.
    setOpen(false)
  }

  return (
    <>
      <Button icon={<ListFilter />} onClick={() => setOpen(true)}>
        Filters
      </Button>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Filters</SheetTitle>
            <SheetDescription>Show only the invoices with these statuses.</SheetDescription>
          </SheetHeader>
          <SheetBody>
            {STATUSES.map((status) => (
              <Label key={status}>
                <Checkbox defaultChecked={status !== 'Paid'} />
                {status}
              </Label>
            ))}
          </SheetBody>
          <SheetFooter>
            <Button variant="primary" onClick={apply}>
              Apply filters
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  )
}
