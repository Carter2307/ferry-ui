import * as React from 'react'
import { Card, CardContent, KeyValueEditor, SaveBar, toast, useKeyValueRows, validateIdentifierKey, type KeyValuePair } from '@roger.b/libui'

const INITIAL: KeyValuePair[] = [
  { key: 'team', value: 'growth' },
  { key: 'cost-center', value: 'CC-4102' },
]

// Module level: the options of the hook stay the same between renders.
const OPTIONS = { validateKey: validateIdentifierKey }

export default function KeyValueEditorSaveBar() {
  const [saved, setSaved] = React.useState(INITIAL)
  const [saving, setSaving] = React.useState(false)
  const labels = useKeyValueRows(saved, OPTIONS)

  function save() {
    const pairs = labels.pairs
    setSaving(true)
    // Stands for a request to the server.
    window.setTimeout(() => {
      setSaved(pairs)
      // The hook reads its argument on the first render only: give it the new saved state.
      labels.reset(pairs)
      setSaving(false)
      toast.success('Labels saved')
    }, 1000)
  }

  return (
    <Card className="mx-auto w-full max-w-xl">
      <CardContent>
        {/* The same validator as the hook: pasted lines and imported lines follow the same rule. */}
        <KeyValueEditor
          value={labels.rows}
          onValueChange={labels.setRows}
          errors={labels.errors}
          validateKey={validateIdentifierKey}
          disabled={saving}
          addLabel="Add label"
          emptyMessage="No labels yet."
        />
      </CardContent>
      <SaveBar
        dirty={labels.dirty}
        invalid={!labels.valid}
        saving={saving}
        hint={`Labels: ${labels.pairs.length}`}
        onReset={() => labels.reset(saved)}
        onSave={save}
      />
    </Card>
  )
}
