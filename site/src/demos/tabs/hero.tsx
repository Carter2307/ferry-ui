import { Card, CardContent, Tabs, TabsContent, TabsList, TabsTrigger } from 'ferry-ui'

export default function TabsHero() {
  return (
    <Tabs defaultValue="overview" className="w-full max-w-lg">
      <TabsList aria-label="Project sections">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="activity">Activity</TabsTrigger>
        <TabsTrigger value="members">Members</TabsTrigger>
      </TabsList>
      <TabsContent value="overview">
        <Card>
          <CardContent className="text-[13px] text-foreground-light">
            The project has 14 open tasks. The next release is on October 18.
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="activity">
        <Card>
          <CardContent className="text-[13px] text-foreground-light">
            Maya Chen moved the task "Pricing page" to the review column.
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="members">
        <Card>
          <CardContent className="text-[13px] text-foreground-light">
            The project has 6 members and 2 invitations with no answer.
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
