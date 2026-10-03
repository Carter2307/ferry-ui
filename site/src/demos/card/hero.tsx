import { Button, Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@roger.b/libui'

export default function CardHero() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <div>
          <CardTitle>Payment method</CardTitle>
          <CardDescription>We charge this card on the first day of each month.</CardDescription>
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
