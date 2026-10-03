import * as React from 'react'
import { Button, DropdownMenuItem, SplitButton, toast } from 'libui'

export default function SplitButtonControlled() {
  const [open, setOpen] = React.useState(false)

  return (
    <>
      <Button variant="ghost" onClick={() => setOpen(true)}>
        Show the other formats
      </Button>
      <SplitButton
        open={open}
        // Always update the state here, or the menu cannot close.
        onOpenChange={setOpen}
        onClick={() => toast.success('CSV export started')}
        menuLabel="More export options"
        menu={
          <>
            <DropdownMenuItem onSelect={() => toast.success('Excel export started')}>Excel (.xlsx)</DropdownMenuItem>
            <DropdownMenuItem onSelect={() => toast.success('PDF export started')}>PDF</DropdownMenuItem>
          </>
        }
      >
        Export CSV
      </SplitButton>
    </>
  )
}
