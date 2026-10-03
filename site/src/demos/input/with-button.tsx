import { Button, Input } from '@roger.b/libui'

export default function InputWithButton() {
  return (
    <div className="flex w-full max-w-sm gap-2">
      <Input size="sm" type="email" placeholder="maya@example.com" aria-label="Email of the new member" />
      <Button size="sm" variant="primary">
        Invite
      </Button>
    </div>
  )
}
