import * as React from 'react'
import { FormActions, FormCard, FormRow, Input, toast } from '@roger.b/libui'

const INITIAL = { name: 'Billing portal', email: 'billing@example.com' }

export default function FormCardHero() {
  const [saved, setSaved] = React.useState(INITIAL)
  const [draft, setDraft] = React.useState(INITIAL)
  const [saving, setSaving] = React.useState(false)
  const dirty = draft.name !== saved.name || draft.email !== saved.email

  function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSaving(true)
    // Stands for a request to the server.
    window.setTimeout(() => {
      setSaved(draft)
      setSaving(false)
      toast.success('Settings saved')
    }, 1000)
  }

  return (
    <FormCard
      className="mx-auto w-full max-w-2xl"
      title="Project"
      description="These settings apply to each member of the project."
      onSubmit={save}
      footer={<FormActions dirty={dirty} saving={saving} onReset={() => setDraft(saved)} />}
    >
      <FormRow label="Name" description="The name shows in the list of projects." htmlFor="project-name">
        <Input value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} />
      </FormRow>
      <FormRow label="Billing email" description="The app sends the invoices to this address." htmlFor="project-email">
        <Input type="email" value={draft.email} onChange={(event) => setDraft({ ...draft, email: event.target.value })} />
      </FormRow>
    </FormCard>
  )
}
