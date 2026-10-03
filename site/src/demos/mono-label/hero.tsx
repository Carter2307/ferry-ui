import { Card, CardContent, CardHeader, MonoLabel } from 'libui'

export default function MonoLabelHero() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <MonoLabel as="h3">Team members</MonoLabel>
      </CardHeader>
      <CardContent className="text-[13px] text-foreground-light">
        The team uses 8 of the 10 seats of the plan.
      </CardContent>
    </Card>
  )
}
