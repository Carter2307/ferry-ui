import * as React from 'react'
import { Label, ResourceCard, ResourceCardSkeleton, ResourceGrid, StatusLine, Switch } from 'libui-kit'
import { LayoutDashboard, Smartphone } from 'lucide-react'

export default function ResourceCardLoading() {
  // In an app, `loading` comes from the request that loads the list.
  const [loading, setLoading] = React.useState(true)

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Switch id="projects-loading" checked={loading} onCheckedChange={setLoading} />
        <Label htmlFor="projects-loading">Loading</Label>
      </div>
      <ResourceGrid aria-label="Projects" aria-busy={loading}>
        {loading ? (
          <>
            <ResourceCardSkeleton />
            <ResourceCardSkeleton />
          </>
        ) : (
          <>
            <ResourceCard
              name="Web app"
              icon={<LayoutDashboard />}
              subtitle="Owner: Maya Chen"
              footer={<StatusLine tone="success">Project is active</StatusLine>}
            />
            <ResourceCard
              name="Mobile app"
              icon={<Smartphone />}
              subtitle="Owner: Jonas Weber"
              footer={<StatusLine tone="success">Project is active</StatusLine>}
            />
          </>
        )}
      </ResourceGrid>
    </div>
  )
}
