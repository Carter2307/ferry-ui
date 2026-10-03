import { Field, Input } from '@roger.b/libui'

export default function InputMono() {
  return (
    <Field label="Webhook URL" hint="The app sends each event to this address." className="w-full max-w-sm">
      <Input mono type="url" placeholder="https://example.com/webhooks" />
    </Field>
  )
}
