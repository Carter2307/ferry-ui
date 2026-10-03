import { Avatar, AvatarBadge, AvatarFallback } from 'libui'
import { Check } from 'lucide-react'

export default function AvatarWithBadge() {
  return (
    <>
      <Avatar size="lg">
        <AvatarFallback>PN</AvatarFallback>
        <AvatarBadge className="bg-success" role="img" aria-label="Online" />
      </Avatar>
      <Avatar size="lg">
        <AvatarFallback>AW</AvatarFallback>
        <AvatarBadge className="bg-warning" role="img" aria-label="Away" />
      </Avatar>
      <Avatar size="lg">
        <AvatarFallback>OB</AvatarFallback>
        <AvatarBadge className="bg-foreground-muted" role="img" aria-label="Offline" />
      </Avatar>
      <Avatar size="lg">
        <AvatarFallback>DK</AvatarFallback>
        <AvatarBadge role="img" aria-label="Verified">
          <Check />
        </AvatarBadge>
      </Avatar>
    </>
  )
}
