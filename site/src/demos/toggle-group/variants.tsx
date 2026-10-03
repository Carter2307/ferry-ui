import { ToggleGroup, ToggleGroupItem } from 'libui-kit'

export default function ToggleGroupVariants() {
  return (
    <>
      <ToggleGroup type="single" defaultValue="month" aria-label="Billing period, default variant">
        <ToggleGroupItem value="month">Monthly</ToggleGroupItem>
        <ToggleGroupItem value="year">Yearly</ToggleGroupItem>
      </ToggleGroup>
      <ToggleGroup type="single" variant="outline" defaultValue="month" aria-label="Billing period, outline variant">
        <ToggleGroupItem value="month">Monthly</ToggleGroupItem>
        <ToggleGroupItem value="year">Yearly</ToggleGroupItem>
      </ToggleGroup>
    </>
  )
}
