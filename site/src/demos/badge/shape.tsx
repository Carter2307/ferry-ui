import { Badge } from '@roger.b/libui'

export default function BadgeShape() {
  return (
    <>
      <Badge shape="pill">Pill</Badge>
      <Badge shape="square">Square</Badge>
      <Badge variant="outline" shape="square" font="mono">
        EUR
      </Badge>
    </>
  )
}
