import * as React from 'react'
import { Label, SecretField, Switch } from 'libui-kit'

export default function CopySecretControlled() {
  const [shown, setShown] = React.useState(false)

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-3">
      <div className="flex items-center gap-2">
        <Switch id="show-keys" checked={shown} onCheckedChange={setShown} />
        <Label htmlFor="show-keys">Show keys</Label>
      </div>
      <SecretField
        value="sk_demo_primary_7c1e9b4a"
        what="primary key"
        aria-label="Primary key"
        revealed={shown}
        onRevealedChange={setShown}
      />
      <SecretField
        value="sk_demo_secondary_2d8f3a6c"
        what="secondary key"
        aria-label="Secondary key"
        revealed={shown}
        onRevealedChange={setShown}
      />
    </div>
  )
}
