import * as React from 'react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle, Checkbox, Label, SaveBar, toast } from 'libui-kit'

export default function SaveBarInline() {
  const [saved, setSaved] = React.useState(true)
  const [digest, setDigest] = React.useState(true)

  return (
    <Card className="mx-auto w-full max-w-xl">
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
      </CardHeader>
      <CardContent>
        <Label className="font-normal">
          <Checkbox checked={digest} onCheckedChange={(checked) => setDigest(checked === true)} />
          Send a summary each Monday
        </Label>
      </CardContent>
      {/* The footer of the card has the border and the padding: the bar adds only the row. */}
      <CardFooter>
        <SaveBar
          variant="inline"
          dirty={digest !== saved}
          onReset={() => setDigest(saved)}
          onSave={() => {
            setSaved(digest)
            toast.success('Notifications saved')
          }}
        />
      </CardFooter>
    </Card>
  )
}
