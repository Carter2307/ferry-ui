import { Tabs, TabsContent, TabsList, TabsTrigger } from 'ferry-ui'

export default function Uncontrolled() {
  return (
    // `defaultValue` gives the first tab. After that, Tabs holds the state.
    <Tabs defaultValue="overview" className="w-full max-w-md">
      <TabsList aria-label="Project sections">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="invoices">Invoices</TabsTrigger>
        <TabsTrigger value="members">Members</TabsTrigger>
      </TabsList>
      <TabsContent value="overview" className="text-[13px] text-foreground-light">
        Billing portal has 3 open invoices and 6 members.
      </TabsContent>
      <TabsContent value="invoices" className="text-[13px] text-foreground-light">
        INV-2041, INV-2042 and INV-2043 are open.
      </TabsContent>
      <TabsContent value="members" className="text-[13px] text-foreground-light">
        Maya Chen, Sam Lee and 4 more members.
      </TabsContent>
    </Tabs>
  )
}
