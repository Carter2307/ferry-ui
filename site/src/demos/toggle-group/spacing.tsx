import { ToggleGroup, ToggleGroupItem } from '@roger.b/libui'

export default function ToggleGroupSpacing() {
  return (
    <ToggleGroup type="multiple" variant="outline" spacing={2} defaultValue={['email']} aria-label="Notification channels">
      <ToggleGroupItem value="email">Email</ToggleGroupItem>
      <ToggleGroupItem value="sms">SMS</ToggleGroupItem>
      <ToggleGroupItem value="push">Push</ToggleGroupItem>
    </ToggleGroup>
  )
}
