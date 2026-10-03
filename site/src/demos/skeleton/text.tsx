import { Skeleton } from 'ferry-ui'

export default function SkeletonText() {
  return (
    <div aria-busy="true" className="flex w-full max-w-xs flex-col gap-2">
      <Skeleton className="h-5 w-40" />
      <Skeleton className="h-3.5 w-full" />
      <Skeleton className="h-3.5 w-full" />
      <Skeleton className="h-3.5 w-3/4" />
    </div>
  )
}
