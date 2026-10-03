import { Avatar, AvatarBadge, AvatarFallback, Card, CardContent, CardFooter, CardHeader, CardTitle } from 'libui-kit'

export default function ContainerClasses() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Workspace</CardTitle>
      </CardHeader>
      <CardContent className="flex items-center gap-3">
        <Avatar className="rounded-md">
          <AvatarFallback>AC</AvatarFallback>
          <AvatarBadge className="bg-success" role="img" aria-label="Active" />
        </Avatar>
        <div className="flex min-w-0 flex-col">
          <span className="truncate text-sm text-foreground">Acme</span>
          <span className="truncate text-[13px] text-foreground-light">12 members, 3 projects</span>
        </div>
      </CardContent>
      <CardFooter className="justify-between text-[13px] text-foreground-light">
        <span>Next invoice</span>
        <span className="tabular text-foreground">Nov 1</span>
      </CardFooter>
    </Card>
  )
}
