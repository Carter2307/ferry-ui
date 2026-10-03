import * as React from 'react'
import {
  Button,
  ConfirmDialog,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  toast,
} from 'ferry-ui'
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react'

export default function DropdownMenuConfirm() {
  const [confirmOpen, setConfirmOpen] = React.useState(false)

  return (
    <>
      <span className="font-mono text-[13px] text-foreground">Analytics export</span>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon-tiny"
            icon={<MoreHorizontal />}
            aria-label="Actions for the API key Analytics export"
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onSelect={() => toast('Rename the API key')}>
            <Pencil /> Rename
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          {/* The item opens the confirmation. It does not revoke the key on a click. */}
          <DropdownMenuItem variant="destructive" onSelect={() => setConfirmOpen(true)}>
            <Trash2 /> Revoke key
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Revoke the API key “Analytics export”?"
        description="Requests with this key fail from now on. This cannot be undone."
        confirmLabel="Revoke key"
        onConfirm={() => {
          toast.success('API key revoked')
        }}
      />
    </>
  )
}
