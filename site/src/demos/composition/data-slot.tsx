import * as React from 'react'
import { Field, Textarea } from '@roger.b/libui'

const LIMIT = 160

export default function DataSlot() {
  const [note, setNote] = React.useState('Send the invoice to the billing contact.')

  return (
    // Field has no class prop for its hint. The selector finds the hint by its data-slot.
    <Field
      label="Note on the invoice"
      hint={`${note.length} / ${LIMIT}`}
      className="w-full max-w-sm [&_[data-slot=field-hint]]:text-right"
    >
      <Textarea maxLength={LIMIT} value={note} onChange={(event) => setNote(event.target.value)} />
    </Field>
  )
}
