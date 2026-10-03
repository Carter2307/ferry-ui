import { Avatar, AvatarFallback } from 'ferry-ui'

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
