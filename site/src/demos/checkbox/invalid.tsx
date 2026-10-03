import * as React from 'react'
import { Button, Checkbox, Label, toast } from 'libui-kit'

export default function CheckboxInvalid() {
  const [accepted, setAccepted] = React.useState(false)
  const [error, setError] = React.useState(false)

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(!accepted)
    if (accepted) toast.success('Workspace created')
  }

  return (
    <form noValidate onSubmit={submit} className="flex flex-col items-start gap-3">
      <Label>
        <Checkbox
          checked={accepted}
          onCheckedChange={(checked) => {
            setAccepted(checked === true)
            setError(false)
          }}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? 'terms-error' : undefined}
        />
        I accept the terms of service
      </Label>
      {error && (
        <p id="terms-error" role="alert" className="text-[13px] text-destructive">
          Accept the terms to continue.
        </p>
      )}
      <Button type="submit" variant="primary">
        Create workspace
      </Button>
    </form>
  )
}
