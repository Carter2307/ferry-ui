import * as React from 'react'
import { Field, Input } from '@roger.b/libui'

export default function FieldErrorAndHint() {
  const [seats, setSeats] = React.useState('80')
  const count = Number(seats)
  const valid = Number.isInteger(count) && count >= 1 && count <= 50

  return (
    <Field
      label="Seats"
      hint="Between 1 and 50. Each seat is on the invoice."
      error={valid ? undefined : 'Enter a whole number between 1 and 50.'}
      errorReplacesHint={false}
      className="mx-auto w-full max-w-sm"
    >
      <Input type="number" value={seats} onChange={(event) => setSeats(event.target.value)} className="w-24 tabular" />
    </Field>
  )
}
