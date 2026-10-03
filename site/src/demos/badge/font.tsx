import { Badge } from '@roger.b/libui'

export default function BadgeFont() {
  return (
    <>
      <Badge>Pro</Badge>
      <Badge font="mono">Pro</Badge>
      <Badge variant="outline" font="mono">
        v2.4.1
      </Badge>
      <Badge variant="outline" font="mono">
        eu-west
      </Badge>
    </>
  )
}
