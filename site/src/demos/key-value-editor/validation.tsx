import { KeyValueEditor, rowsFromPairs, validateIdentifierKey } from 'libui-kit'

const VARIABLES = rowsFromPairs([
  { key: 'MAX_RETRIES', value: '5' },
  { key: '', value: 'eu-west' },
  { key: 'MAX_RETRIES', value: '3' },
  { key: '2FA_REQUIRED', value: 'true' },
])

export default function KeyValueEditorValidation() {
  return (
    <KeyValueEditor
      className="mx-auto w-full max-w-xl"
      defaultValue={VARIABLES}
      validateKey={validateIdentifierKey}
      keyLabel="Variable"
      keyPlaceholder="NAME"
      addLabel="Add variable"
      itemNoun={{ one: 'variable', other: 'variables' }}
    />
  )
}
