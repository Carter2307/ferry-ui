import { Card, CardContent, CardHeader, Skeleton } from 'ferry-ui'

export default function CardLoading() {
  return (
    <Card className="w-full max-w-md" aria-busy="true">
      <CardHeader>
        <div className="flex flex-col gap-1.5">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3.5 w-48" />
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <Skeleton className="h-3.5 w-full" />
        <Skeleton className="h-3.5 w-full" />
        <Skeleton className="h-3.5 w-2/3" />
      </CardContent>
    </Card>
  )
}
