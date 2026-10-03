import * as React from 'react'
import { Label, RadioGroup, RadioGroupItem } from '@roger.b/libui'

const PLANS = [
  { value: 'starter', label: 'Starter', price: '$0' },
  { value: 'pro', label: 'Pro', price: '$29' },
  { value: 'team', label: 'Team', price: '$99' },
]

export default function RadioGroupControlled() {
  const [plan, setPlan] = React.useState('pro')
  const price = PLANS.find((item) => item.value === plan)?.price

  return (
    <div className="flex flex-col gap-4">
      <RadioGroup aria-label="Plan" value={plan} onValueChange={setPlan}>
        {PLANS.map((item) => (
          <Label key={item.value} className="font-normal">
            <RadioGroupItem value={item.value} />
            {item.label}
          </Label>
        ))}
      </RadioGroup>
      <p className="text-[13px] text-foreground-light">Price: {price} each month</p>
    </div>
  )
}
