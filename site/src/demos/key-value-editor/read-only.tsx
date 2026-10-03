import { KeyValueEditor, rowsFromPairs } from 'libui'

const HEADERS = rowsFromPairs([
  { key: 'Accept', value: 'application/json' },
  { key: 'Authorization', value: 'Bearer tok_demo_8f2a91c4', secret: true },
  { key: 'X-Api-Version', value: '2026-01' },
])

export default function KeyValueEditorReadOnly() {
  return (
    <KeyValueEditor
      className="mx-auto w-full max-w-xl"
      readOnly
      defaultValue={HEADERS}
      keyLabel="Header"
      listLabel="Webhook headers"
    />
  )
}
