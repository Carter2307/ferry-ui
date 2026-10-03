import * as React from 'react'
import { Card, CardContent, Field, Input, SaveBar, toast } from 'ferry-ui'

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function SaveBarInvalid() {
  const [saved, setSaved] = React.useState('billing@example.com')
  const [email, setEmail] = React.useState('billing@example')
  // Live validation: the code checks the value on each change.
  const invalid = !EMAIL.test(email)

  return (
    <Card className="mx-auto w-full max-w-xl">
      <CardContent>
        <Field label="Billing email" error={invalid ? 'Enter a valid email address.' : undefined}>
          <Input type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
        </Field>
      </CardContent>
      <SaveBar
        dirty={email !== saved}
        invalid={invalid}
        onReset={() => setEmail(saved)}
        onSave={() => {
          setSaved(email)
          toast.success('Email saved')
        }}
      />
    </Card>
  )
}
