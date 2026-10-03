import { Field, Textarea } from 'libui'

export default function TextareaHero() {
  return (
    <Field label="Description" optional hint="The description shows on the project page." className="w-full max-w-md">
      <Textarea placeholder="What is this project for?" />
    </Field>
  )
}
