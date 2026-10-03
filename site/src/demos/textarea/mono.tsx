import { Field, Textarea } from 'libui-kit'

const PAYLOAD = `{
  "event": "invoice.paid",
  "invoice": "INV-2041",
  "amount": 1280,
  "currency": "eur"
}`

export default function TextareaMono() {
  return (
    <Field label="Test payload" hint="The app sends this JSON to your endpoint." className="w-full max-w-md">
      <Textarea mono defaultValue={PAYLOAD} />
    </Field>
  )
}
