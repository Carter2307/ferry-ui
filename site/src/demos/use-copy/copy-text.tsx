import { Button, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, copyText, toast } from 'libui'
import { MoreHorizontal } from 'lucide-react'

export default function UseCopyCopyText() {
  // No hook: copyText() gives the result, and this code shows its own messages.
  const copyId = async () => {
    const ok = await copyText('inv_2041')
    if (ok) toast.success('Invoice ID copied')
    else toast.error('Could not copy the invoice ID')
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" icon={<MoreHorizontal />} aria-label="Actions for INV-2041" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onSelect={() => void copyId()}>Copy invoice ID</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
