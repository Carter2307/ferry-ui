import * as React from 'react'
import { FormActions, FormCard, FormRow, Input, toast } from 'ferry-ui'

const SLUG = /^[a-z0-9-]+$/

export default function FormCardValidation() {
  const [saved, setSaved] = React.useState('billing-portal')
  const [slug, setSlug] = React.useState('Billing portal')
  const [submitted, setSubmitted] = React.useState(false)
  const error = submitted && !SLUG.test(slug) ? 'Use lowercase letters, digits and dashes only.' : undefined

  function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    // The form has `noValidate`: the code does the validation on submit.
    setSubmitted(true)
    if (!SLUG.test(slug)) return
    setSaved(slug)
    setSubmitted(false)
    toast.success('Settings saved')
  }

  return (
    <FormCard
      className="mx-auto w-full max-w-2xl"
      title="Workspace"
      onSubmit={save}
      footer={<FormActions dirty={slug !== saved} invalid={error !== undefined} />}
    >
      <FormRow label="Slug" description="The slug is a part of the workspace URL." htmlFor="workspace-slug" error={error}>
        <Input mono value={slug} onChange={(event) => setSlug(event.target.value)} />
      </FormRow>
    </FormCard>
  )
}
