import * as React from 'react'
import { Button, Callout, Field, Input } from 'ferry-ui'

export default function ValidationErrors() {
  const [name, setName] = React.useState('')
  const [nameError, setNameError] = React.useState<string>()
  const [submitError, setSubmitError] = React.useState<string>()

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitError(undefined)
    if (name.trim() === '') {
      setNameError('Enter a project name.')
      return
    }
    setNameError(undefined)
    // A real app sends the form here. In this demo, the request always fails.
    setSubmitError('The server did not save the project. Try again.')
  }

  return (
    <form noValidate onSubmit={submit} className="flex w-full max-w-sm flex-col gap-5">
      <Field label="Project name" hint="The members see this name." error={nameError}>
        <Input value={name} onChange={(event) => setName(event.target.value)} />
      </Field>
      {submitError && (
        <Callout tone="destructive" size="sm">
          {submitError}
        </Callout>
      )}
      <Button type="submit" variant="primary" size="md" className="self-end">
        Create project
      </Button>
    </form>
  )
}
