import { Badge, Button, Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@roger.b/libui'
import { ArrowUpRight } from 'lucide-react'

export default function CardWithFooter() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <div>
          <CardTitle>Usage this month</CardTitle>
          <CardDescription>The count starts again on October 1.</CardDescription>
        </div>
        <CardAction>
          <Badge variant="warning">82%</Badge>
        </CardAction>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline gap-1">
          <span className="tabular text-2xl font-medium text-foreground">8,214</span>
          <span className="text-sm text-foreground-lighter">/ 10,000 requests</span>
        </div>
      </CardContent>
      <CardFooter className="justify-between">
        <span className="text-[13px] text-foreground-lighter">A higher plan has higher limits.</span>
        <Button iconRight={<ArrowUpRight />}>View plans</Button>
      </CardFooter>
    </Card>
  )
}
