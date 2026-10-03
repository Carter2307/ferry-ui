import {
  FormCard,
  FormRow,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  ToggleGroup,
  ToggleGroupItem,
} from 'ferry-ui'

export default function FormCardComposite() {
  return (
    <FormCard asDiv className="mx-auto w-full max-w-2xl" title="Invoices" description="The defaults for new invoices.">
      <FormRow label="Currency" description="The currency of each new invoice." htmlFor="invoice-currency">
        {/* With `htmlFor`: `control` has the id and the ids of the description and of the error. */}
        {(control) => (
          <Select defaultValue="eur">
            <SelectTrigger {...control} className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent position="popper">
              <SelectItem value="eur">Euro (EUR)</SelectItem>
              <SelectItem value="usd">US dollar (USD)</SelectItem>
              <SelectItem value="gbp">Pound sterling (GBP)</SelectItem>
            </SelectContent>
          </Select>
        )}
      </FormRow>
      <FormRow label="Payment terms" description="The time that a customer has to pay an invoice.">
        {/* No `htmlFor`: `control` also has `aria-labelledby`, which names the group. */}
        {(control) => (
          <ToggleGroup {...control} type="single" variant="outline" defaultValue="30">
            <ToggleGroupItem value="14">14 days</ToggleGroupItem>
            <ToggleGroupItem value="30">30 days</ToggleGroupItem>
            <ToggleGroupItem value="60">60 days</ToggleGroupItem>
          </ToggleGroup>
        )}
      </FormRow>
    </FormCard>
  )
}
