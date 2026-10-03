import * as React from 'react'
import { Button, Field, Label, RadioGroup, RadioGroupItem } from 'libui-kit'

export default function RadioGroupForm() {
  const [sent, setSent] = React.useState<string>()

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    // The form holds one "visibility" entry: the value of the selected option.
    setSent(String(new FormData(event.currentTarget).get('visibility')))
  }

  return (
    <form onSubmit={submit} className="flex flex-col items-start gap-4">
      <Field label="Visibility of the project" labelAs="span">
        <RadioGroup name="visibility" defaultValue="private" required>
          <Label className="font-normal">
            <RadioGroupItem value="private" />
            Private
          </Label>
          <Label className="font-normal">
            <RadioGroupItem value="public" />
            Public
          </Label>
        </RadioGroup>
      </Field>
      <Button type="submit">Save</Button>
      <p role="status" className="text-[13px] text-foreground-light">
        {sent !== undefined && `The form sent: ${sent}`}
      </p>
    </form>
  )
}
