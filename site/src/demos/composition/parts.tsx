import { Button, Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from 'libui'

export default function Parts() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <div>
          <CardTitle>Payment method</CardTitle>
          <CardDescription>The charge date is the first day of each month.</CardDescription>
        </div>
        <CardAction>
          <Button size="tiny">Replace</Button>
        </CardAction>
      </CardHeader>
      <CardContent className="text-sm">Card ending in 4242</CardContent>
      <CardFooter className="justify-between text-[13px] text-foreground-light">Next charge on Nov 1</CardFooter>
    </Card>
  )
}
