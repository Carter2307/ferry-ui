import { FormCard, FormRow, Switch } from 'libui-kit'

export default function SwitchHero() {
  return (
    <FormCard asDiv title="Notifications">
      <FormRow
        label="Invoice emails"
        description="Send a copy of each invoice to the billing contact."
        htmlFor="invoice-emails"
      >
        <Switch defaultChecked />
      </FormRow>
      <FormRow label="Weekly digest" description="Send a summary of the activity each Monday." htmlFor="weekly-digest">
        <Switch />
      </FormRow>
    </FormCard>
  )
}
