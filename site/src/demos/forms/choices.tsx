import { Checkbox, Field, Label, RadioGroup, RadioGroupItem, Switch } from '@roger.b/libui'

export default function Choices() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-5">
      {/* One value among a few options. `labelAs="span"`: a group has no single control to focus. */}
      <Field label="Billing period" labelAs="span">
        <RadioGroup defaultValue="monthly">
          <Label>
            <RadioGroupItem value="monthly" /> Monthly
          </Label>
          <Label>
            <RadioGroupItem value="yearly" /> Yearly
          </Label>
        </RadioGroup>
      </Field>
      {/* A choice that the form saves on submit. */}
      <Label>
        <Checkbox defaultChecked /> Send each invoice by email
      </Label>
      {/* A setting that applies immediately. */}
      <div className="flex items-center gap-2">
        <Switch id="choices-notifications" defaultChecked />
        <Label htmlFor="choices-notifications">Email notifications</Label>
      </div>
    </div>
  )
}
