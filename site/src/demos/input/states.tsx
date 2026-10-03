import { Field, Input } from 'libui'

export default function InputStates() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-5">
      <Field label="Workspace" hint="Only an owner can change the name.">
        <Input disabled defaultValue="Acme" />
      </Field>
      <Field label="Project ID">
        <Input readOnly mono defaultValue="prj_8f2k1m9x" />
      </Field>
      <Field label="Billing email" error="Enter a valid email address.">
        <Input type="email" defaultValue="maya@example" />
      </Field>
    </div>
  )
}
