import { Button, Field, Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, toast } from 'ferry-ui'

export default function StackedFields() {
  return (
    <form
      className="flex w-full max-w-sm flex-col gap-5"
      onSubmit={(event) => {
        event.preventDefault()
        toast.success('Invitation sent')
      }}
    >
      <Field label="Email" hint="The member gets a link by email.">
        <Input type="email" name="email" placeholder="maya@example.com" />
      </Field>
      <Field label="Role" hint="An admin can manage billing and members.">
        {/* A control with many parts: spread `control` on the part that gets the focus. */}
        {(control) => (
          <Select name="role" defaultValue="member">
            <SelectTrigger {...control} className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="member">Member</SelectItem>
              <SelectItem value="viewer">Viewer</SelectItem>
            </SelectContent>
          </Select>
        )}
      </Field>
      <Field label="Team" optional>
        <Input name="team" placeholder="Design" />
      </Field>
      <Button type="submit" variant="primary" size="md" className="self-end">
        Send invitation
      </Button>
    </form>
  )
}
