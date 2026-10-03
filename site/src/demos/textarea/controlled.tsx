import * as React from 'react'
import { Field, Textarea } from '@roger.b/libui'

const MAX_LENGTH = 280

export default function TextareaControlled() {
  const [message, setMessage] = React.useState('')

  return (
    <Field label="Feedback" hint={`${MAX_LENGTH - message.length} characters left`} className="w-full max-w-md">
      <Textarea
        placeholder="What must we change on the billing page?"
        maxLength={MAX_LENGTH}
        value={message}
        onChange={(event) => setMessage(event.target.value)}
      />
    </Field>
  )
}
