import * as React from 'react'
import { Card, CardContent, Field, Input, SaveBar, getErrorMessage } from 'ferry-ui'

// Stands for a request that the server refuses.
const refuse = () =>
  new Promise<void>((_, reject) => {
    window.setTimeout(() => reject(new Error('The server refused the request. Try again.')), 1000)
  })

export default function SaveBarError() {
  const [name, setName] = React.useState('Billing portal 2')
  const [saving, setSaving] = React.useState(false)
  const [error, setError] = React.useState<string>()

  async function save() {
    setSaving(true)
    setError(undefined)
    try {
      await refuse()
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setSaving(false)
    }
  }

  return (
    <Card className="mx-auto w-full max-w-xl">
      <CardContent>
        <Field label="Project name">
          <Input value={name} onChange={(event) => setName(event.target.value)} />
        </Field>
      </CardContent>
      <SaveBar
        dirty={name !== 'Billing portal'}
        saving={saving}
        error={error}
        onReset={() => {
          setName('Billing portal')
          setError(undefined)
        }}
        onSave={() => void save()}
      />
    </Card>
  )
}
