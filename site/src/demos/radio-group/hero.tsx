import { Field, Label, RadioGroup, RadioGroupItem } from '@roger.b/libui'

export default function RadioGroupHero() {
  return (
    <Field label="Billing period" labelAs="span" hint="The new period starts with the next invoice.">
      <RadioGroup defaultValue="monthly">
        <Label className="font-normal">
          <RadioGroupItem value="monthly" />
          Monthly
        </Label>
        <Label className="font-normal">
          <RadioGroupItem value="yearly" />
          Yearly, with two months free
        </Label>
      </RadioGroup>
    </Field>
  )
}
