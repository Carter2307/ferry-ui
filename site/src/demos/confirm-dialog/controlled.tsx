import * as React from 'react'
import {
  Button,
  ConfirmDialog,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  toast,
} from 'libui-kit'
import { MoreHorizontal, Trash2 } from 'lucide-react'

export default function ConfirmDialogControlled() {
  const [confirmOpen, setConfirmOpen] = React.useState(false)

  return (
    <>
      <div className="flex w-full max-w-sm items-center justify-between gap-3 rounded-lg border bg-surface-100 px-4 py-2.5">
        <span className="text-sm text-foreground">Analytics export</span>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon-tiny"
              icon={<MoreHorizontal />}
              aria-label="Actions for Analytics export"
            />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem variant="destructive" onSelect={() => setConfirmOpen(true)}>
              <Trash2 /> Revoke key
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Revoke API key “Analytics export”?"
        description="Requests that use this key start to fail immediately. You cannot undo this."
        confirmLabel="Revoke key"
        onConfirm={() => {
          toast.success('API key revoked')
        }}
      />
    </>
  )
}
