import * as React from 'react'
import { ConfirmDialog, DropdownMenuItem, DropdownMenuSeparator, SplitButton, toast } from 'libui-kit'
import { Ban, RefreshCw } from 'lucide-react'

export default function SplitButtonDestructive() {
  const [open, setOpen] = React.useState(false)
  const [all, setAll] = React.useState(false)

  function ask(allKeys: boolean) {
    setAll(allKeys)
    setOpen(true)
  }

  return (
    <>
      <SplitButton
        variant="destructive"
        onClick={() => ask(false)}
        menuLabel="More revoke options"
        menuProps={{ className: 'w-64' }}
        menu={
          <>
            <DropdownMenuItem onSelect={() => toast.success('Key replaced')}>
              <RefreshCw /> Revoke and create a replacement
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive" onSelect={() => ask(true)}>
              <Ban /> Revoke all API keys…
            </DropdownMenuItem>
          </>
        }
      >
        Revoke key
      </SplitButton>
      <ConfirmDialog
        open={open}
        onOpenChange={setOpen}
        title={all ? 'Revoke all API keys?' : 'Revoke API key “Analytics export”?'}
        description="Requests that use a revoked key start to fail immediately. You cannot undo this."
        confirmLabel={all ? 'Revoke all keys' : 'Revoke key'}
        onConfirm={() => {
          toast.success(all ? 'All API keys revoked' : 'API key revoked')
        }}
      />
    </>
  )
}
