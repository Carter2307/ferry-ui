import * as React from 'react'
import { Button, RadioCardGroup, type RadioCardOption } from 'libui-kit'

type Period = 'monthly' | 'yearly'

const OPTIONS: RadioCardOption<Period>[] = [
  { value: 'monthly', label: 'Monthly', description: 'One invoice each month.' },
  { value: 'yearly', label: 'Yearly', description: 'One invoice each year.' },
]

export default function RadioCardGroupControlled() {
  // `null`, not `undefined`: the group stays controlled while no card is selected.
  const [period, setPeriod] = React.useState<Period | null>(null)

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-3">
      <RadioCardGroup
        aria-label="Billing period"
        size="sm"
        columns={2}
        options={OPTIONS}
        value={period}
        onValueChange={setPeriod}
      />
      <div className="flex items-center justify-between gap-3">
        <span className="text-[13px] text-foreground-light">Selected: {period ?? 'none'}</span>
        <Button disabled={period === null} onClick={() => setPeriod(null)}>
          Clear
        </Button>
      </div>
    </div>
  )
}
