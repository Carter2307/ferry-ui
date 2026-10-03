import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle, Field, SaveBar, Textarea } from 'libui'

const MESSAGE = 'Thank you for your order. The invoice is in the attachment.'

export default function LongForm() {
  const [saved, setSaved] = React.useState(MESSAGE)
  const [message, setMessage] = React.useState(MESSAGE)
  const [saving, setSaving] = React.useState(false)
  const empty = message.trim() === ''

  function save() {
    setSaving(true)
    window.setTimeout(() => {
      setSaved(message)
      setSaving(false)
    }, 1000)
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Invoice email</CardTitle>
      </CardHeader>
      <CardContent>
        <Field label="Message" hint="Each customer gets this text." error={empty ? 'Enter a message.' : undefined}>
          <Textarea value={message} disabled={saving} onChange={(event) => setMessage(event.target.value)} />
        </Field>
      </CardContent>
      <SaveBar
        dirty={message !== saved}
        invalid={empty}
        saving={saving}
        hint="All changes saved"
        onReset={() => setMessage(saved)}
        onSave={save}
      />
    </Card>
  )
}
