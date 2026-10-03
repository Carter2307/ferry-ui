import { Label, Switch } from 'libui-kit'

export default function LabelHtmlFor() {
  return (
    <div className="flex items-center gap-2">
      <Switch id="two-factor" defaultChecked />
      <Label htmlFor="two-factor">Two-factor authentication</Label>
    </div>
  )
}
