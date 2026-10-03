import * as React from 'react'
import { Label, Switch, toast } from '@roger.b/libui'

export default function SwitchControlled() {
  const [enabled, setEnabled] = React.useState(false)

  function change(checked: boolean) {
    setEnabled(checked)
    // A switch has no Save button: save the setting here.
    toast.success(checked ? 'Maintenance mode is on' : 'Maintenance mode is off')
  }

  return (
    <div className="flex items-center gap-2">
      <Switch id="maintenance-mode" checked={enabled} onCheckedChange={change} />
      <Label htmlFor="maintenance-mode">Maintenance mode</Label>
    </div>
  )
}
