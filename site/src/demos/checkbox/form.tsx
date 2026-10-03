import * as React from 'react'
import { Button, Checkbox, Label } from 'libui-kit'

const PERMISSIONS = [
  { value: 'read', label: 'Read projects' },
  { value: 'write', label: 'Create and edit projects' },
  { value: 'billing', label: 'Manage billing' },
]

export default function CheckboxForm() {
  const [sent, setSent] = React.useState<string>()

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    // The form holds one "permissions" entry for each checked checkbox.
    const values = new FormData(event.currentTarget).getAll('permissions')
    setSent(values.length > 0 ? values.join(', ') : 'no permission')
  }

  return (
    <form onSubmit={submit} className="flex flex-col items-start gap-4">
      <fieldset className="flex flex-col gap-3">
        <legend className="mb-3 text-sm font-medium text-foreground">Permissions of the API key</legend>
        {PERMISSIONS.map((permission) => (
          <Label key={permission.value} className="font-normal">
            <Checkbox name="permissions" value={permission.value} defaultChecked={permission.value === 'read'} />
            {permission.label}
          </Label>
        ))}
      </fieldset>
      <Button type="submit">Create key</Button>
      <p role="status" className="text-[13px] text-foreground-light">
        {sent !== undefined && `The form sent: ${sent}`}
      </p>
    </form>
  )
}
