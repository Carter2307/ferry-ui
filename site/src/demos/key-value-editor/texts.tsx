import { KeyValueEditor } from 'libui-kit'

export default function KeyValueEditorTexts() {
  return (
    <KeyValueEditor
      className="mx-auto w-full max-w-xl"
      keyLabel="Tag"
      keyPlaceholder="tag"
      addLabel="Add tag"
      importLabel="Import tags"
      itemNoun={{ one: 'tag', other: 'tags' }}
      listLabel="Invoice tags"
      emptyMessage="No tags yet. Add one, or import a list."
    />
  )
}
