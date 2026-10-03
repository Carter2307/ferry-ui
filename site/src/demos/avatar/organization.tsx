import { Avatar, AvatarFallback } from 'ferry-ui'
import { Building2 } from 'lucide-react'

export default function AvatarOrganization() {
  return (
    <div className="flex items-center gap-3">
      <Avatar className="rounded-md">
        <AvatarFallback className="bg-primary-soft text-primary">
          <Building2 className="size-4" />
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-col">
        <span className="text-sm font-medium text-foreground">Acme</span>
        <span className="text-[13px] text-foreground-light">12 members</span>
      </div>
    </div>
  )
}
