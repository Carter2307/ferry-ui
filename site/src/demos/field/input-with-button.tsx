import { Button, Field, Input } from 'ferry-ui'
import { Plus } from 'lucide-react'

export default function FieldInputWithButton() {
  return (
    <Field label="Invite by email" hint="The member gets an email with a link." className="mx-auto w-full max-w-sm">
      {(control) => (
        <div className="flex gap-2">
          <Input {...control} type="email" placeholder="maya@example.com" />
          <Button icon={<Plus />} size="md" className="shrink-0">
            Add
          </Button>
        </div>
      )}
    </Field>
  )
}
