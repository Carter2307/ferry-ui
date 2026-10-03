import { Label, Switch } from 'libui'

export default function SwitchSizes() {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <Switch id="switch-md" size="md" defaultChecked />
        <Label htmlFor="switch-md">Medium, 34 × 20px</Label>
      </div>
      <div className="flex items-center gap-2">
        <Switch id="switch-sm" size="sm" defaultChecked />
        <Label htmlFor="switch-sm">Small, 28 × 16px</Label>
      </div>
    </div>
  )
}
