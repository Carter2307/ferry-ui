import { Badge } from 'libui-kit'

export default function BadgeHero() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-base font-medium text-foreground">Billing portal</span>
      <Badge font="mono" shape="square">
        Pro
      </Badge>
      <Badge variant="outline" font="mono">
        v2.4.1
      </Badge>
      <Badge variant="primary">New</Badge>
    </div>
  )
}
