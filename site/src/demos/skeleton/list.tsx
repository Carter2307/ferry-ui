import { Skeleton } from 'libui'

export default function SkeletonList() {
  return (
    <div aria-busy="true" className="flex w-full max-w-sm flex-col gap-2">
      <Skeleton className="h-11 w-full" />
      <Skeleton className="h-11 w-full" />
      <Skeleton className="h-11 w-full" />
    </div>
  )
}
