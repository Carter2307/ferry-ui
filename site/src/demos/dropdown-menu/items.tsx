import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
  toast,
  useModKey,
} from 'libui'
import { Copy, Download, MoreHorizontal, Send } from 'lucide-react'

export default function DropdownMenuItems() {
  const mod = useModKey()
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" icon={<MoreHorizontal />} aria-label="Actions for INV-2041" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        <DropdownMenuLabel>Invoice INV-2041</DropdownMenuLabel>
        <DropdownMenuGroup>
          <DropdownMenuItem onSelect={() => toast.success('Invoice duplicated')}>
            <Copy /> Duplicate
            <DropdownMenuShortcut>{mod} D</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => toast('The download starts')}>
            <Download /> Download PDF
          </DropdownMenuItem>
          {/* The customer paid this invoice: the action is not available. */}
          <DropdownMenuItem disabled>
            <Send /> Send a reminder
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={() => toast('Open the customer')}>View customer</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
