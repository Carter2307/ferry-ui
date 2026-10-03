import { Badge } from 'libui'
import { Lock, Sparkles, Users } from 'lucide-react'

export default function BadgeIcons() {
  return (
    <>
      <Badge variant="outline" case="normal">
        <Lock />
        Private
      </Badge>
      <Badge case="normal">
        <Users />8 members
      </Badge>
      <Badge variant="primary">
        <Sparkles />
        New
      </Badge>
    </>
  )
}
