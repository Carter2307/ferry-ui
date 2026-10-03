import { Field, ToggleGroup, ToggleGroupItem } from '@roger.b/libui'
import { Monitor, Moon, Sun } from 'lucide-react'

export default function ToggleGroupField() {
  return (
    <Field label="Theme" labelAs="span" hint="The system option follows the theme of the device.">
      <ToggleGroup type="single" variant="outline" defaultValue="system">
        <ToggleGroupItem value="light">
          <Sun /> Light
        </ToggleGroupItem>
        <ToggleGroupItem value="dark">
          <Moon /> Dark
        </ToggleGroupItem>
        <ToggleGroupItem value="system">
          <Monitor /> System
        </ToggleGroupItem>
      </ToggleGroup>
    </Field>
  )
}
