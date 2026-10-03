import { Badge, Tabs, TabsContent, TabsList, TabsTrigger } from 'libui-kit'
import { CircleCheck, CircleDot, GitPullRequest } from 'lucide-react'

export default function TabsIcons() {
  return (
    <Tabs defaultValue="open" className="w-full max-w-lg">
      <TabsList aria-label="Tasks">
        <TabsTrigger value="open">
          <CircleDot /> Open <Badge>24</Badge>
        </TabsTrigger>
        <TabsTrigger value="review">
          <GitPullRequest /> In review <Badge>3</Badge>
        </TabsTrigger>
        <TabsTrigger value="closed">
          <CircleCheck /> Closed
        </TabsTrigger>
      </TabsList>
      <TabsContent value="open" className="text-[13px] text-foreground-light">
        The 24 tasks that are open.
      </TabsContent>
      <TabsContent value="review" className="text-[13px] text-foreground-light">
        The 3 tasks that wait for a review.
      </TabsContent>
      <TabsContent value="closed" className="text-[13px] text-foreground-light">
        The tasks that are done.
      </TabsContent>
    </Tabs>
  )
}
