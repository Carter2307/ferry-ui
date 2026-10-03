import { Field, Textarea } from 'libui-kit'

export default function TextareaStates() {
  return (
    <div className="flex w-full max-w-md flex-col gap-5">
      <Field label="Notes">
        <Textarea disabled defaultValue="You cannot edit an archived project." />
      </Field>
      <Field label="Reason" error="Enter 10 characters or more.">
        <Textarea defaultValue="Too short" />
      </Field>
    </div>
  )
}
