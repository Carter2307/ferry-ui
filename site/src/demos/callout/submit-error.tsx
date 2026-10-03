import * as React from 'react'
import { Button, Callout, Field, Input } from 'libui-kit'

const TAKEN_SLUGS = ['billing-portal', 'docs']

export default function CalloutSubmitError() {
  const [slug, setSlug] = React.useState('billing-portal')
  const [error, setError] = React.useState<string>()

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    // The server refuses a slug that another project uses.
    setError(TAKEN_SLUGS.includes(slug.trim()) ? `The slug "${slug.trim()}" is not available.` : undefined)
  }

  return (
    <form onSubmit={submit} className="flex w-full max-w-sm flex-col gap-4">
      <Field label="Project slug">
        <Input mono value={slug} onChange={(event) => setSlug(event.target.value)} />
      </Field>
      {error && (
        <Callout tone="destructive" size="sm">
          {error}
        </Callout>
      )}
      <Button type="submit" variant="primary" className="self-end">
        Save
      </Button>
    </form>
  )
}
