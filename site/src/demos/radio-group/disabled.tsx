import { Label, RadioGroup, RadioGroupItem } from 'libui-kit'

export default function RadioGroupDisabled() {
  return (
    <RadioGroup aria-label="Billing period" defaultValue="monthly">
      <Label className="font-normal">
        <RadioGroupItem value="monthly" />
        Monthly
      </Label>
      <Label className="font-normal">
        <RadioGroupItem value="yearly" />
        Yearly
      </Label>
      <Label className="font-normal">
        <RadioGroupItem value="custom" disabled />
        Custom contract, on the Enterprise plan only
      </Label>
    </RadioGroup>
  )
}
