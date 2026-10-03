import * as React from 'react'
import { Field, Input } from 'libui'

export default function InputControlled() {
  const [name, setName] = React.useState('Billing portal')
  const slug = name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')

  return (
    <Field label="Project name" hint={`Slug: ${slug === '' ? 'none' : slug}`} className="w-full max-w-sm">
      <Input value={name} onChange={(event) => setName(event.target.value)} />
    </Field>
  )
}
