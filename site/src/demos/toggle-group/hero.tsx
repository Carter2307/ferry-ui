import { ToggleGroup, ToggleGroupItem } from 'ferry-ui'

export default function ToggleGroupHero() {
  return (
    <ToggleGroup type="single" variant="outline" defaultValue="30" aria-label="Period of the report">
      <ToggleGroupItem value="7">7 days</ToggleGroupItem>
      <ToggleGroupItem value="30">30 days</ToggleGroupItem>
      <ToggleGroupItem value="90">90 days</ToggleGroupItem>
    </ToggleGroup>
  )
}
