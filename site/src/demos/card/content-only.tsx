import { Card, CardContent } from 'libui'

export default function CardContentOnly() {
  return (
    <Card className="w-full max-w-md">
      <CardContent>
        <p className="text-sm text-foreground-light">
          API keys give your backend access to the workspace. Keep them out of your source code.
        </p>
      </CardContent>
    </Card>
  )
}
