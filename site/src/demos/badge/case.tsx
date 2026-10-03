import { Badge } from 'libui-kit'

export default function BadgeCase() {
  return (
    <>
      <Badge variant="outline">Design team</Badge>
      <Badge variant="outline" case="normal">
        Design team
      </Badge>
      <Badge case="normal">3 seats left</Badge>
    </>
  )
}
