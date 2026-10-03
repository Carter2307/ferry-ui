import * as React from 'react'
import { FormActions, FormCard, FormRow, Input, toast } from '@roger.b/libui'

export default function FormCardFooter() {
  const [saved, setSaved] = React.useState('500')
  const [limit, setLimit] = React.useState('500')

  return (
    // The card is a `<div>`: Save calls `onSave`, it does not submit a form.
    <FormCard
      asDiv
      className="mx-auto w-full max-w-2xl"
      title="Usage limits"
      footer={
        <FormActions
          dirty={limit !== saved}
          hint="The limit applies to new requests only"
          saveLabel="Apply limit"
          onReset={() => setLimit(saved)}
          onSave={() => {
            setSaved(limit)
            toast.success('Limit applied')
          }}
        />
      }
    >
      <FormRow label="Requests per minute" htmlFor="limit-requests" controlClassName="max-w-32">
        <Input type="number" value={limit} onChange={(event) => setLimit(event.target.value)} className="tabular" />
      </FormRow>
    </FormCard>
  )
}
