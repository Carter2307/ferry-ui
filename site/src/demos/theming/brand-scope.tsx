import type { CSSProperties } from 'react'
import { Button, Checkbox, Label, MonoLabel, Switch, UsageBar } from '@roger.b/libui'

// The source variables of the primary color and of the brand color, for one container.
const PARTNER_BRAND = {
  '--primary-solid': 'oklch(0.55 0.2 290)',
  '--primary-solid-border': 'oklch(0.48 0.2 290)',
  '--ring': 'oklch(0.55 0.2 290 / 0.75)',
  '--brand': 'oklch(0.55 0.2 290)',
} as CSSProperties

function Controls() {
  return (
    <div className="flex flex-col items-start gap-3">
      <Label>
        <Checkbox defaultChecked /> Send a weekly digest
      </Label>
      <Label>
        <Switch size="sm" defaultChecked /> Email notifications
      </Label>
      <UsageBar value={40} tone="brand" label="Storage used" />
      <Button variant="primary">Save changes</Button>
    </div>
  )
}

export default function BrandScope() {
  return (
    <div className="grid w-full gap-4 sm:grid-cols-2">
      <section className="flex flex-col gap-4 rounded-lg border p-5">
        <MonoLabel as="h3">Colors of the app</MonoLabel>
        <Controls />
      </section>
      <section style={PARTNER_BRAND} className="flex flex-col gap-4 rounded-lg border p-5">
        <MonoLabel as="h3">Colors of this container</MonoLabel>
        <Controls />
      </section>
    </div>
  )
}
