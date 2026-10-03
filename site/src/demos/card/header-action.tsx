import { Button, Card, CardAction, CardContent, CardHeader, CardTitle } from 'libui-kit'
import { MoreHorizontal, Plus } from 'lucide-react'

export default function CardHeaderAction() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>API keys</CardTitle>
        <CardAction>
          <Button size="tiny" icon={<Plus />}>
            New key
          </Button>
          <Button variant="ghost" size="icon-tiny" icon={<MoreHorizontal />} aria-label="More actions" />
        </CardAction>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-foreground-light">Keys give programs access to your workspace.</p>
      </CardContent>
    </Card>
  )
}
