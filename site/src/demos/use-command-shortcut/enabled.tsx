import * as React from 'react'
import { Kbd, Label, Switch, useCommandShortcut, useModKey } from 'libui-kit'

export default function UseCommandShortcutEnabled() {
  const [enabled, setEnabled] = React.useState(true)
  const [count, setCount] = React.useState(0)
  const mod = useModKey()
  // The hook listens only while `enabled` is true.
  useCommandShortcut(() => setCount((current) => current + 1), { key: 'u', enabled })
  return (
    <div className="flex flex-col items-center gap-4">
      <p className="flex items-center gap-2 text-sm text-foreground-light">
        Press <Kbd>{mod} U</Kbd>
        <span className="text-foreground tabular">Presses: {count}</span>
      </p>
      <div className="flex items-center gap-2">
        <Switch id="shortcut-enabled" checked={enabled} onCheckedChange={setEnabled} />
        <Label htmlFor="shortcut-enabled">Shortcut enabled</Label>
      </div>
    </div>
  )
}
