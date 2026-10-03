import * as React from 'react'
import { Avatar, AvatarFallback, Button, Skeleton } from 'ferry-ui'

export default function SkeletonContent() {
  const [loading, setLoading] = React.useState(false)

  function reload() {
    setLoading(true)
    window.setTimeout(() => setLoading(false), 1500)
  }

  return (
    <div className="flex w-full max-w-xs flex-col gap-4">
      <div aria-busy={loading} className="flex items-center gap-3 rounded-lg border bg-surface-100 p-4">
        {loading ? (
          <>
            <Skeleton className="size-8 rounded-full" />
            <div className="flex h-10 flex-col justify-center gap-1.5">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3.5 w-36" />
            </div>
          </>
        ) : (
          <>
            <Avatar>
              <AvatarFallback>MC</AvatarFallback>
            </Avatar>
            <div className="flex h-10 flex-col justify-center">
              <span className="text-sm font-medium text-foreground">Maya Chen</span>
              <span className="text-[13px] text-foreground-light">maya@example.com</span>
            </div>
          </>
        )}
      </div>
      <Button className="self-start" loading={loading} onClick={reload}>
        Load again
      </Button>
    </div>
  )
}
