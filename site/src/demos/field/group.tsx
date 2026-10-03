import { Field, Label, RadioGroup, RadioGroupItem } from '@roger.b/libui'

export default function FieldGroup() {
  return (
    <Field label="Billing period" labelAs="span" hint="You can change the period later." className="mx-auto w-full max-w-sm">
      <RadioGroup defaultValue="monthly">
        <Label className="font-normal">
          <RadioGroupItem value="monthly" /> Monthly
        </Label>
        <Label className="font-normal">
          <RadioGroupItem value="yearly" /> Yearly, two months free
        </Label>
      </RadioGroup>
    </Field>
  )
}
