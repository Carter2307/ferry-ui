import { FormCard, FormRow, Input, Textarea } from 'libui'

export default function FormCardLayout() {
  return (
    <FormCard asDiv className="mx-auto w-full max-w-2xl" title="Invoices">
      <FormRow
        label="Payment terms"
        description="The number of days that a customer has to pay."
        htmlFor="terms-days"
        controlClassName="max-w-24"
      >
        <Input type="number" defaultValue="30" className="tabular" />
      </FormRow>
      <FormRow
        layout="vertical"
        label="Footer note"
        description="The text at the bottom of each invoice."
        htmlFor="invoice-note"
      >
        <Textarea defaultValue="Thank you for your order. Send your questions to billing@example.com." />
      </FormRow>
    </FormCard>
  )
}
