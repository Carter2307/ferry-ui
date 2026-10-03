import { Checkbox, Label } from '@roger.b/libui'

const EVENTS = [
  { value: 'invoice-paid', label: 'A customer pays an invoice', checked: true },
  { value: 'payment-failed', label: 'A payment fails', checked: true },
  { value: 'member-joined', label: 'A member joins the workspace', checked: false },
]

export default function CheckboxHero() {
  return (
    <fieldset className="flex flex-col gap-3">
      <legend className="mb-3 text-sm font-medium text-foreground">Send me an email when</legend>
      {EVENTS.map((event) => (
        <Label key={event.value} className="font-normal">
          <Checkbox defaultChecked={event.checked} />
          {event.label}
        </Label>
      ))}
    </fieldset>
  )
}
