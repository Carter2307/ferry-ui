import * as React from 'react'
import { Button, Field, Label, RadioGroup, RadioGroupItem, toast } from 'ferry-ui'

const FORMATS = ['CSV', 'PDF', 'JSON']

export default function RadioGroupInvalid() {
  const [format, setFormat] = React.useState('')
  const [error, setError] = React.useState<string>()

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(format === '' ? 'Select an export format.' : undefined)
    if (format !== '') toast.success('Export started')
  }

  function change(value: string) {
    setFormat(value)
    setError(undefined)
  }

  return (
    <form noValidate onSubmit={submit} className="flex flex-col items-start gap-4">
      <Field label="Export the invoices as" labelAs="span" error={error}>
        <RadioGroup value={format} onValueChange={change} className="flex gap-4">
          {FORMATS.map((name) => (
            <Label key={name} className="font-normal">
              <RadioGroupItem value={name.toLowerCase()} aria-invalid={error ? true : undefined} />
              {name}
            </Label>
          ))}
        </RadioGroup>
      </Field>
      <Button type="submit">Export</Button>
    </form>
  )
}
