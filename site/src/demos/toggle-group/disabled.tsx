import { ToggleGroup, ToggleGroupItem } from '@roger.b/libui'

export default function ToggleGroupDisabled() {
  return (
    <>
      <ToggleGroup type="single" variant="outline" defaultValue="month" aria-label="Billing period">
        <ToggleGroupItem value="month">Monthly</ToggleGroupItem>
        <ToggleGroupItem value="year">Yearly</ToggleGroupItem>
        <ToggleGroupItem value="lifetime" disabled>
          Lifetime
        </ToggleGroupItem>
      </ToggleGroup>
      <ToggleGroup type="single" variant="outline" defaultValue="month" disabled aria-label="Billing period, disabled">
        <ToggleGroupItem value="month">Monthly</ToggleGroupItem>
        <ToggleGroupItem value="year">Yearly</ToggleGroupItem>
      </ToggleGroup>
    </>
  )
}
