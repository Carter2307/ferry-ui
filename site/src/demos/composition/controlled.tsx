import * as React from 'react'
import { Button, Tabs, TabsContent, TabsList, TabsTrigger } from 'libui'

export default function Controlled() {
  // The state is in your code: you read it and you change it.
  const [tab, setTab] = React.useState('overview')

  return (
    <Tabs value={tab} onValueChange={setTab} className="w-full max-w-md">
      <TabsList aria-label="Project sections">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="invoices">Invoices</TabsTrigger>
      </TabsList>
      <TabsContent value="overview" className="flex items-center justify-between gap-3 text-[13px] text-foreground-light">
        Billing portal has 3 open invoices.
        <Button size="tiny" onClick={() => setTab('invoices')}>
          Show the invoices
        </Button>
      </TabsContent>
      <TabsContent value="invoices" className="text-[13px] text-foreground-light">
        INV-2041, INV-2042 and INV-2043 are open.
      </TabsContent>
    </Tabs>
  )
}
