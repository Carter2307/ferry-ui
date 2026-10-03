import { Button, Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from 'ferry-ui'

export default function CardLongTitle() {
  return (
    <Card className="w-full max-w-xs">
      <CardHeader>
        {/* min-w-0 lets the title block get smaller than its text. */}
        <div className="min-w-0">
          <CardTitle className="truncate">Plan for the customer support and the sales teams</CardTitle>
          <CardDescription className="truncate">Last edit by Maya Chen, three days ago</CardDescription>
        </div>
        <CardAction>
          <Button size="tiny">Open</Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-foreground-light">The text of the body wraps on more than one line.</p>
      </CardContent>
    </Card>
  )
}
