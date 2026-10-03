import * as React from 'react'
import { KeyValueEditor, Label, Switch, rowsFromPairs } from 'libui-kit'

const HEADERS = rowsFromPairs([
  { key: 'Accept', value: 'application/json' },
  { key: 'Authorization', value: 'Bearer tok_demo_8f2a91c4', secret: true },
  { key: 'X-Signature', value: 'sig_demo_31b9e0a4c2', secret: true },
])

export default function KeyValueEditorSecret() {
  const [revealAll, setRevealAll] = React.useState(false)

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-4">
      <div className="flex items-center gap-2">
        <Switch id="reveal-all-values" size="sm" checked={revealAll} onCheckedChange={setRevealAll} />
        <Label htmlFor="reveal-all-values" className="font-normal">
          Reveal all values
        </Label>
      </div>
      <KeyValueEditor
        defaultValue={HEADERS}
        revealAll={revealAll}
        keyLabel="Header"
        keyPlaceholder="X-Header-Name"
        addLabel="Add header"
        itemNoun={{ one: 'header', other: 'headers' }}
      />
    </div>
  )
}
