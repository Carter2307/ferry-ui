import * as React from 'react'
import { Button, Field, RadioCardGroup, toast, type RadioCardOption } from 'libui'

const PLANS: RadioCardOption[] = [
  { value: 'free', label: 'Free', description: 'For one member and three projects.' },
  { value: 'pro', label: 'Pro', description: 'For a team, with no limit on projects.' },
]

export default function RadioCardGroupInvalid() {
  const [plan, setPlan] = React.useState<string | null>(null)
  const [submitted, setSubmitted] = React.useState(false)

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitted(true)
    if (plan !== null) toast.success('Plan selected')
  }

  return (
    <form noValidate className="mx-auto flex w-full max-w-xl flex-col gap-5" onSubmit={submit}>
      {/* `Field` names the group and sets `aria-invalid` on it while it shows the error. */}
      <Field
        label="Plan"
        labelAs="span"
        error={submitted && plan === null ? 'Select a plan to continue.' : undefined}
      >
        <RadioCardGroup size="sm" columns={2} options={PLANS} value={plan} onValueChange={setPlan} />
      </Field>
      <Button type="submit" variant="primary" className="self-end">
        Continue
      </Button>
    </form>
  )
}
