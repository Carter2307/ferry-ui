import { Badge, DropdownMenuItem, DropdownMenuSeparator, TopBarUserMenu } from 'libui-kit'
import { Building2, CreditCard, LogOut, Settings, UserRound, Users } from 'lucide-react'

export default function TopBarUserMenuDemo() {
  return (
    <>
      <TopBarUserMenu name="Maya Chen" description="maya@example.com">
        <DropdownMenuItem>
          <UserRound /> Profile
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Settings /> Account settings
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <LogOut /> Sign out
        </DropdownMenuItem>
      </TopBarUserMenu>

      <TopBarUserMenu
        label="Workspace account"
        fallback={<Building2 className="size-3.5" />}
        align="start"
        header={
          <div className="flex items-center justify-between gap-2 px-2 py-1.5 text-[13px] text-foreground">
            <span className="truncate font-medium">Acme</span>
            <Badge font="mono" case="normal">
              Pro
            </Badge>
          </div>
        }
      >
        <DropdownMenuItem>
          <Users /> Members
        </DropdownMenuItem>
        <DropdownMenuItem>
          <CreditCard /> Billing
        </DropdownMenuItem>
      </TopBarUserMenu>
    </>
  )
}
