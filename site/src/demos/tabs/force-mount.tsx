import { Field, Input, Tabs, TabsContent, TabsList, TabsTrigger, Textarea } from 'libui'

export default function TabsForceMount() {
  return (
    <Tabs defaultValue="details" className="w-full max-w-md">
      <TabsList aria-label="Invoice form">
        <TabsTrigger value="details">Details</TabsTrigger>
        <TabsTrigger value="notes">Notes</TabsTrigger>
      </TabsList>
      {/* Each panel stays mounted. The class hides the panel that is not active. */}
      <TabsContent value="details" forceMount className="data-[state=inactive]:hidden">
        <Field label="Customer">
          <Input placeholder="Acme" />
        </Field>
      </TabsContent>
      <TabsContent value="notes" forceMount className="data-[state=inactive]:hidden">
        <Field label="Notes for the customer">
          <Textarea placeholder="Thank you for your order." />
        </Field>
      </TabsContent>
    </Tabs>
  )
}
