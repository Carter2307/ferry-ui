import { Avatar, AvatarFallback, AvatarImage } from 'libui-kit'
import { User } from 'lucide-react'

export default function AvatarFallbackDemo() {
  return (
    <>
      <Avatar>
        {/* This picture cannot load: the initials stay in view. */}
        <AvatarImage src="data:image/png;base64,AA==" alt="Sam Patel" />
        <AvatarFallback>SP</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback>AL</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback>
          <User className="size-4" />
        </AvatarFallback>
      </Avatar>
    </>
  )
}
