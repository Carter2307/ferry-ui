import { Field, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from 'ferry-ui'

export default function SelectHero() {
  return (
    <Field label="Currency" hint="New invoices use this currency." className="w-full max-w-xs">
      {(control) => (
        <Select defaultValue="eur">
          <SelectTrigger {...control} className="w-full">
            <SelectValue placeholder="Select a currency" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="usd">US dollar</SelectItem>
            <SelectItem value="eur">Euro</SelectItem>
            <SelectItem value="gbp">Pound sterling</SelectItem>
            <SelectItem value="jpy">Japanese yen</SelectItem>
            <SelectItem value="chf">Swiss franc</SelectItem>
          </SelectContent>
        </Select>
      )}
    </Field>
  )
}
