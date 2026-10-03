import { Field, Textarea } from 'libui'

const RELEASE_NOTES = [
  '- Invoices: the list loads faster.',
  '- Invoices: a filter by status.',
  '- Members: an owner can change a role from the list.',
  '- Members: an invitation stays valid for seven days.',
  '- API keys: each key shows the date of its last use.',
  '- Orders: the export contains the customer email.',
  '- Projects: the search finds archived projects.',
  '- Settings: a new page for the billing address.',
  '- Fixed: the total of an order with a discount.',
  '- Fixed: the date format in the exports.',
].join('\n')

export default function TextareaMaxHeight() {
  return (
    <Field label="Release notes" className="w-full max-w-md">
      <Textarea className="max-h-40" defaultValue={RELEASE_NOTES} />
    </Field>
  )
}
