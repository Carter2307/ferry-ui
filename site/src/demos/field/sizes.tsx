import { Field, Input } from 'libui-kit'

export default function FieldSizes() {
  return (
    <div className="mx-auto flex w-full max-w-sm flex-col gap-6">
      <Field size="md" label="Medium" hint="For a form in a page.">
        <Input placeholder="Billing portal" />
      </Field>
      <Field size="sm" label="Small" hint="For a form in a dialog or a popover.">
        <Input placeholder="Billing portal" />
      </Field>
    </div>
  )
}
