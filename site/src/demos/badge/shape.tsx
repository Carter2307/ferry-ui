import { Badge } from 'ferry-ui'

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
