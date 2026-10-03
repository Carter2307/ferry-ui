import { Avatar, AvatarBadge, AvatarFallback } from '@roger.b/libui'

export default function AvatarHero() {
  return (
    <div className="flex items-center gap-3">
      <Avatar>
        <AvatarFallback>MC</AvatarFallback>
        <AvatarBadge className="bg-success" role="img" aria-label="Online" />
      </Avatar>
      <div className="flex flex-col">
        <span className="text-sm font-medium text-foreground">Maya Chen</span>
        <span className="text-[13px] text-foreground-light">maya@example.com</span>
      </div>
    </div>
  )
}
