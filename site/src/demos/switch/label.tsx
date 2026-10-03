import { Label, Switch } from 'libui'

export default function SwitchLabel() {
  return (
    <div className="flex items-center gap-2">
      <Switch id="compact-sidebar" />
      <Label htmlFor="compact-sidebar">Compact sidebar</Label>
    </div>
  )
}
