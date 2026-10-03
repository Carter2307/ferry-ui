import { Skeleton } from '@roger.b/libui'

export default function SkeletonShapes() {
  return (
    <>
      {/* An avatar */}
      <Skeleton className="size-8 rounded-full" />
      {/* A square picture */}
      <Skeleton className="size-10 rounded-md" />
      {/* A badge */}
      <Skeleton className="h-5 w-12 rounded-full" />
      {/* A field or a button */}
      <Skeleton className="h-[34px] w-28" />
      {/* A line of text */}
      <Skeleton className="h-4 w-40" />
    </>
  )
}
