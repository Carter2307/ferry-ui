import * as React from 'react'
import { Field, Input } from '@roger.b/libui'

export default function FieldError() {
  const [email, setEmail] = React.useState('maya@example')
  const valid = /^\S+@\S+\.\S+$/.test(email)

  return (
    <Field
      className="w-full max-w-xs"
      label="Billing email"
      hint="Invoices go to this address."
      error={valid ? undefined : 'Enter a valid email address.'}
    >
      <Input type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
    </Field>
  )
}
