import { Input, Label } from '@roger.b/libui'

export default function InputLabel() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-2">
      <Label htmlFor="billing-email">Billing email</Label>
      <Input id="billing-email" type="email" placeholder="maya@example.com" />
    </div>
  )
}
