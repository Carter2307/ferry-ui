import { Label, RadioGroup, RadioGroupItem } from 'libui-kit'

export default function RadioGroupRow() {
  return (
    <RadioGroup aria-label="Export format" defaultValue="csv" className="flex gap-4">
      <Label className="font-normal">
        <RadioGroupItem value="csv" />
        CSV
      </Label>
      <Label className="font-normal">
        <RadioGroupItem value="pdf" />
        PDF
      </Label>
      <Label className="font-normal">
        <RadioGroupItem value="json" />
        JSON
      </Label>
    </RadioGroup>
  )
}
