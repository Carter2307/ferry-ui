import * as React from 'react'
import { Button } from 'ferry-ui'

export default function ButtonLoading() {
  const [saving, setSaving] = React.useState(false)

  function save() {
    setSaving(true)
    window.setTimeout(() => setSaving(false), 1500)
  }

  return (
    <Button variant="primary" loading={saving} onClick={save}>
      {saving ? 'Saving…' : 'Save changes'}
    </Button>
  )
}
