import * as React from 'react'
import { Button, Field, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, toast } from '@roger.b/libui'

export default function SelectInvalid() {
  const [role, setRole] = React.useState('')
  const [error, setError] = React.useState<string>()

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(role === '' ? 'Select a role for this member.' : undefined)
    if (role !== '') toast.success('Invitation sent')
  }

  function change(value: string) {
    setRole(value)
    setError(undefined)
  }

  return (
    <form noValidate onSubmit={submit} className="flex w-full max-w-xs flex-col items-start gap-4">
      <Field label="Role" error={error} className="w-full">
        {(control) => (
          <Select value={role} onValueChange={change}>
            <SelectTrigger {...control} className="w-full">
              <SelectValue placeholder="Select a role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="viewer">Viewer</SelectItem>
              <SelectItem value="member">Member</SelectItem>
              <SelectItem value="billing">Billing manager</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
            </SelectContent>
          </Select>
        )}
      </Field>
      <Button type="submit">Send invitation</Button>
    </form>
  )
}
