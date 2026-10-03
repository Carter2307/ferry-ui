import { Card, CardContent, CardHeader, CardTitle, Tabs, TabsContent, TabsList, TabsTrigger } from '@roger.b/libui'

export default function TabsPills() {
  return (
    <Tabs defaultValue="monthly" className="w-full max-w-sm">
      <Card>
        <CardHeader>
          <CardTitle>Pro plan</CardTitle>
          <TabsList variant="pills" aria-label="Billing period">
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
            <TabsTrigger value="yearly">Yearly</TabsTrigger>
          </TabsList>
        </CardHeader>
        <CardContent className="text-[13px] text-foreground-light">
          <TabsContent value="monthly">$24 for each seat, with one invoice each month.</TabsContent>
          <TabsContent value="yearly">$20 for each seat, with one invoice each year.</TabsContent>
        </CardContent>
      </Card>
    </Tabs>
  )
}
