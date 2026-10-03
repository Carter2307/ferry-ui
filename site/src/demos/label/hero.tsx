import { Input, Label } from '@roger.b/libui'

export default function LabelHero() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-2">
      <Label htmlFor="member-email">Email address</Label>
      <Input id="member-email" type="email" placeholder="maya@example.com" />
    </div>
  )
}
