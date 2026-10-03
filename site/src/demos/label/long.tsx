import { Checkbox, Label } from 'libui'

export default function LabelLong() {
  return (
    <div className="flex w-full max-w-sm items-start gap-2">
      <Checkbox id="usage-data" className="mt-0.5" />
      <Label htmlFor="usage-data">
        I agree that the team uses my usage data to make the product better, as the privacy policy describes.
      </Label>
    </div>
  )
}
