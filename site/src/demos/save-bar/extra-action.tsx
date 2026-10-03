import * as React from 'react'
import { Card, CardContent, Field, Input, SaveBar, toast } from 'libui'
import { Send } from 'lucide-react'

export default function SaveBarExtraAction() {
  const [saved, setSaved] = React.useState('Release notes')
  const [title, setTitle] = React.useState('Release notes for March')
  const [pending, setPending] = React.useState<'draft' | 'publish'>()

  function save(kind: 'draft' | 'publish') {
    setPending(kind)
    // Stands for a request to the server.
    window.setTimeout(() => {
      setSaved(title)
      setPending(undefined)
      toast.success(kind === 'draft' ? 'Draft saved' : 'Page published')
    }, 1000)
  }

  return (
    <Card className="mx-auto w-full max-w-xl">
      <CardContent>
        <Field label="Page title">
          <Input value={title} onChange={(event) => setTitle(event.target.value)} />
        </Field>
      </CardContent>
      <SaveBar
        dirty={title !== saved}
        saving={pending === 'draft'}
        saveLabel="Save draft"
        onReset={() => setTitle(saved)}
        onSave={() => save('draft')}
        extraAction={{
          label: 'Save and publish',
          icon: <Send />,
          hint: 'Saves the page, then shows it to the customers',
          loading: pending === 'publish',
          onClick: () => save('publish'),
        }}
      />
    </Card>
  )
}
