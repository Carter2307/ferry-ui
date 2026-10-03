import { Field, Input } from 'libui'

export default function InputHero() {
  return (
    <Field label="Project name" hint="The name shows in the list of projects." className="w-full max-w-sm">
      <Input placeholder="Billing portal" />
    </Field>
  )
}
