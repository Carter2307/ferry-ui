import { Skeleton } from 'libui-kit'

export default function SkeletonHero() {
  return (
    <div aria-busy="true" className="flex w-full max-w-xs items-center gap-3 rounded-lg border bg-surface-100 p-4">
      <Skeleton className="size-10 rounded-full" />
      <div className="flex flex-1 flex-col gap-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-3.5 w-44" />
      </div>
    </div>
  )
}
