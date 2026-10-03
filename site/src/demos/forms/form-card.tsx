import * as React from 'react'
import {
  Checkbox,
  FormActions,
  FormCard,
  FormRow,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  toast,
} from 'ferry-ui'

const SETTINGS = { name: 'Billing portal', currency: 'eur', digest: true }

export default function SettingsSection() {
  const [saved, setSaved] = React.useState(SETTINGS)
  const [draft, setDraft] = React.useState(SETTINGS)
  const dirty = draft.name !== saved.name || draft.currency !== saved.currency || draft.digest !== saved.digest

  return (
    <FormCard
      title="General"
      description="These settings apply to all the members of the project."
      onSubmit={(event) => {
        event.preventDefault()
        setSaved(draft)
        toast.success('Settings saved')
      }}
      footer={<FormActions dirty={dirty} onReset={() => setDraft(saved)} />}
    >
      <FormRow label="Name" description="The name shows in the list of projects." htmlFor="settings-name">
        <Input value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} />
      </FormRow>
      <FormRow label="Currency" description="The currency of new invoices." htmlFor="settings-currency">
        {(control) => (
          <Select value={draft.currency} onValueChange={(currency) => setDraft({ ...draft, currency })}>
            <SelectTrigger {...control} className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="usd">US dollar</SelectItem>
              <SelectItem value="eur">Euro</SelectItem>
              <SelectItem value="gbp">Pound sterling</SelectItem>
            </SelectContent>
          </Select>
        )}
      </FormRow>
      <FormRow label="Weekly digest" description="A summary by email each Monday." htmlFor="settings-digest">
        <Checkbox checked={draft.digest} onCheckedChange={(checked) => setDraft({ ...draft, digest: checked === true })} />
      </FormRow>
    </FormCard>
  )
}
