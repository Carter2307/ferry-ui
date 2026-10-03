import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle, Field, Input, SaveBar, Textarea, toast } from 'ferry-ui'

const INITIAL = {
  subject: 'Your invoice from Acme',
  message: 'Hello,\n\nYour invoice is ready. Thank you for your order.',
}

export default function SaveBarHero() {
  const [saved, setSaved] = React.useState(INITIAL)
  const [draft, setDraft] = React.useState(INITIAL)
  const [saving, setSaving] = React.useState(false)
  const dirty = draft.subject !== saved.subject || draft.message !== saved.message

  function save() {
    setSaving(true)
    // Stands for a request to the server.
    window.setTimeout(() => {
      setSaved(draft)
      setSaving(false)
      toast.success('Template saved')
    }, 1000)
  }

  return (
    <Card className="mx-auto w-full max-w-xl">
      <CardHeader>
        <CardTitle>Invoice email</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        <Field label="Subject">
          <Input value={draft.subject} onChange={(event) => setDraft({ ...draft, subject: event.target.value })} />
        </Field>
        <Field label="Message">
          <Textarea value={draft.message} onChange={(event) => setDraft({ ...draft, message: event.target.value })} />
        </Field>
      </CardContent>
      <SaveBar
        dirty={dirty}
        saving={saving}
        hint="All changes saved"
        onReset={() => setDraft(saved)}
        onSave={save}
      />
    </Card>
  )
}
