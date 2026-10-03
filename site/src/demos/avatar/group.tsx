import { Avatar, AvatarFallback, AvatarGroup, AvatarGroupCount } from '@roger.b/libui'

const MEMBERS = [
  { name: 'Maya Chen', initials: 'MC' },
  { name: 'Jordan Reyes', initials: 'JR' },
  { name: 'Priya Nair', initials: 'PN' },
  { name: 'Lucas Martin', initials: 'LM' },
]

export default function AvatarGroupDemo() {
  return (
    <AvatarGroup>
      {MEMBERS.map((member) => (
        <Avatar key={member.name}>
          <AvatarFallback>{member.initials}</AvatarFallback>
        </Avatar>
      ))}
      <AvatarGroupCount>+5</AvatarGroupCount>
    </AvatarGroup>
  )
}
