import { Checkbox, Input, Label } from 'libui-kit'

export default function LabelDisabled() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-5">
      <div className="flex items-center gap-2">
        <Checkbox id="weekly-digest" disabled />
        <Label htmlFor="weekly-digest">Send the weekly digest</Label>
      </div>
      <div data-disabled="true" className="group flex flex-col gap-2">
        <Label htmlFor="billing-contact">Billing email</Label>
        <Input id="billing-contact" disabled defaultValue="billing@example.com" />
      </div>
    </div>
  )
}
