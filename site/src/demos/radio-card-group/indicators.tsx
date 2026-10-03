import { RadioCardGroup, type RadioCardOption } from '@roger.b/libui'

const OPTIONS: RadioCardOption[] = [
  { value: 'monthly', label: 'Monthly', description: 'One invoice each month.' },
  { value: 'yearly', label: 'Yearly', description: 'One invoice each year.' },
]

export default function RadioCardGroupIndicators() {
  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-6">
      <RadioCardGroup aria-label="Billing period, check mark" indicator="check" size="sm" columns={2} defaultValue="monthly" options={OPTIONS} />
      <RadioCardGroup aria-label="Billing period, radio mark" indicator="radio" size="sm" columns={2} defaultValue="monthly" options={OPTIONS} />
      <RadioCardGroup aria-label="Billing period, no mark" indicator="none" size="sm" columns={2} defaultValue="monthly" options={OPTIONS} />
    </div>
  )
}
