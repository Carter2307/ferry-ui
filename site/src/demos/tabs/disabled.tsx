import { Tabs, TabsContent, TabsList, TabsTrigger } from 'libui-kit'

export default function TabsDisabled() {
  return (
    <Tabs defaultValue="overview" className="w-full max-w-lg">
      <TabsList aria-label="Project sections">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="invoices">Invoices</TabsTrigger>
        <TabsTrigger value="audit" disabled>
          Audit log
        </TabsTrigger>
      </TabsList>
      <TabsContent value="overview" className="text-[13px] text-foreground-light">
        The overview of the project.
      </TabsContent>
      <TabsContent value="invoices" className="text-[13px] text-foreground-light">
        The invoices of the project.
      </TabsContent>
    </Tabs>
  )
}
