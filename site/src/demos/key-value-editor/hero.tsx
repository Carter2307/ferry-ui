import { Card, CardContent, CardDescription, CardHeader, CardTitle, KeyValueEditor, rowsFromPairs } from 'libui-kit'

// `rowsFromPairs` gives each pair a stable row id.
const LABELS = rowsFromPairs([
  { key: 'team', value: 'growth' },
  { key: 'cost-center', value: 'CC-4102' },
  { key: 'owner', value: 'maya@example.com' },
])

export default function KeyValueEditorHero() {
  return (
    <Card className="mx-auto w-full max-w-xl">
      <CardHeader>
        <div>
          <CardTitle>Labels</CardTitle>
          <CardDescription>The labels of the project “Billing portal”.</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <KeyValueEditor
          defaultValue={LABELS}
          addLabel="Add label"
          itemNoun={{ one: 'label', other: 'labels' }}
          listLabel="Project labels"
        />
      </CardContent>
    </Card>
  )
}
