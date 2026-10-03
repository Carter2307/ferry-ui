import { Button, Field, Input, Textarea } from '@roger.b/libui'

export default function FieldHero() {
  return (
    <form className="mx-auto flex w-full max-w-sm flex-col gap-5" onSubmit={(event) => event.preventDefault()}>
      <Field label="Project name">
        <Input placeholder="Billing portal" />
      </Field>
      <Field label="Billing email" hint="The app sends the invoices to this address.">
        <Input type="email" placeholder="maya@example.com" />
      </Field>
      <Field label="Description" optional>
        <Textarea placeholder="What is this project about?" />
      </Field>
      <Button type="submit" variant="primary" size="md" className="self-end">
        Create project
      </Button>
    </form>
  )
}
