import { CopyField, Field, Input } from 'libui-kit'

export default function FieldLabelVariants() {
  return (
    <div className="mx-auto flex w-full max-w-sm flex-col gap-6">
      <Field label="Project name" hint="The default label.">
        <Input placeholder="Billing portal" />
      </Field>
      <Field labelVariant="subtle" label="Email" hint="The subtle label.">
        <Input type="email" placeholder="maya@example.com" />
      </Field>
      <Field labelVariant="mono" size="sm" label="API base URL" hint="The mono label, above a value to copy.">
        <CopyField size="sm" value="https://api.example.com/v1" what="API base URL" />
      </Field>
    </div>
  )
}
