import { Field, Input } from 'libui'

export default function FieldOptional() {
  return (
    <div className="mx-auto flex w-full max-w-sm flex-col gap-5">
      <Field label="Company" optional hint="The name shows on your invoices.">
        <Input placeholder="Acme" />
      </Field>
      <Field label="Tax number" optional="(if you have one)">
        <Input mono />
      </Field>
    </div>
  )
}
