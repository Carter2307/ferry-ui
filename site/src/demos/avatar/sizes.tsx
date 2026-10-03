import { Avatar, AvatarFallback } from 'libui'

const SIZES = ['sm', 'md', 'lg'] as const

export default function AvatarSizes() {
  return (
    <>
      {SIZES.map((size) => (
        <Avatar key={size} size={size}>
          <AvatarFallback>JR</AvatarFallback>
        </Avatar>
      ))}
    </>
  )
}
