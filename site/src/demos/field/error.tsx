import * as React from 'react'
import { Field, Input } from '@roger.b/libui'

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function FieldError() {
  const [email, setEmail] = React.useState('maya@example')
  const error = email !== '' && !EMAIL.test(email) ? 'Enter a valid email address.' : undefined

  return (
    <Field label="Work email" hint="The app sends the sign-in link here." error={error} className="mx-auto w-full max-w-sm">
      <Input type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
    </Field>
  )
}
