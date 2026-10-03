import { Checkbox, Label, MonoLabel } from 'ferry-ui'

export default function MonoLabelLegend() {
  return (
    <fieldset className="flex w-full max-w-xs flex-col gap-2.5">
      <MonoLabel as="legend" className="mb-2">
        Email notifications
      </MonoLabel>
      <Label className="text-[13px] font-normal text-foreground-light">
        <Checkbox name="notifications" value="invoices" defaultChecked />
        New invoices
      </Label>
      <Label className="text-[13px] font-normal text-foreground-light">
        <Checkbox name="notifications" value="summary" />
        Weekly summary
      </Label>
    </fieldset>
  )
}
