import { Field, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from 'libui-kit'

export default function FieldRenderFunction() {
  return (
    <Field label="Currency" hint="The app uses it for new invoices." className="mx-auto w-full max-w-sm">
      {(control) => (
        <Select defaultValue="eur">
          {/* The trigger takes the focus: it gets the id and the ARIA attributes. */}
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
    </Field>
  )
}
