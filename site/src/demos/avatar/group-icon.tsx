import { Avatar, AvatarFallback, AvatarGroup, AvatarGroupCount } from '@roger.b/libui'
import { Plus } from 'lucide-react'

const MEMBERS = [
  { name: 'Maya Chen', initials: 'MC' },
  { name: 'Jordan Reyes', initials: 'JR' },
  { name: 'Priya Nair', initials: 'PN' },
]

export default function AvatarGroupIcon() {
  return (
    <AvatarGroup>
      {MEMBERS.map((member) => (
        <Avatar key={member.name} size="sm">
          <AvatarFallback>{member.initials}</AvatarFallback>
        </Avatar>
      ))}
      <AvatarGroupCount>
        <Plus aria-hidden="true" />
        <span className="sr-only">12 more members</span>
      </AvatarGroupCount>
    </AvatarGroup>
  )
}
