import { Field, Textarea } from 'ferry-ui'

export default function TextareaFixed() {
  return (
    <Field label="Short note" className="w-full max-w-md">
      <Textarea className="field-sizing-fixed" rows={3} placeholder="Three rows, always" />
    </Field>
  )
}
