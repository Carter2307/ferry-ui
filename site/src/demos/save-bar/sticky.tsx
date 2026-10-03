import * as React from 'react'
import { Card, Field, Input, SaveBar, Textarea, toast } from '@roger.b/libui'

const INITIAL = { company: 'Acme', email: 'billing@example.com', address: '12 Market Street\nSpringfield' }

export default function SaveBarSticky() {
  const [saved, setSaved] = React.useState(INITIAL)
  const [draft, setDraft] = React.useState(INITIAL)
  const dirty = draft.company !== saved.company || draft.email !== saved.email || draft.address !== saved.address

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!dirty) return
    setSaved(draft)
    toast.success('Billing profile saved')
  }

  return (
    <Card className="mx-auto w-full max-w-xl">
      {/* The form scrolls. The bar has no `onSave`: Save submits the form. */}
      <form className="flex max-h-72 flex-col overflow-y-auto" onSubmit={submit}>
        <div className="flex flex-col gap-5 px-5 py-5 md:px-6">
          <Field label="Company name">
            <Input value={draft.company} onChange={(event) => setDraft({ ...draft, company: event.target.value })} />
          </Field>
          <Field label="Billing email">
            <Input type="email" value={draft.email} onChange={(event) => setDraft({ ...draft, email: event.target.value })} />
          </Field>
          <Field label="Billing address">
            <Textarea value={draft.address} onChange={(event) => setDraft({ ...draft, address: event.target.value })} />
          </Field>
        </div>
        <SaveBar sticky dirty={dirty} hint="These values show on each invoice" onReset={() => setDraft(saved)} />
      </form>
    </Card>
  )
}
