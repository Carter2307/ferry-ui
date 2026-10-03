import * as React from 'react'
import { Button, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, toast } from 'ferry-ui'
import { ChevronDown, ChevronUp } from 'lucide-react'

export default function DropdownMenuControlled() {
  const [open, setOpen] = React.useState(false)

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        {/* The trigger reads the state: the arrow changes while the menu is open. */}
        <Button iconRight={open ? <ChevronUp /> : <ChevronDown />}>Export</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-40">
        <DropdownMenuItem onSelect={() => toast.success('CSV export ready')}>CSV file</DropdownMenuItem>
        <DropdownMenuItem onSelect={() => toast.success('PDF export ready')}>PDF file</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
