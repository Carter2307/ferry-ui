import { ToggleGroup, ToggleGroupItem } from 'libui-kit'

const SIZES = ['tiny', 'sm', 'md'] as const

export default function ToggleGroupSizes() {
  return (
    <>
      {SIZES.map((size) => (
        <ToggleGroup key={size} type="single" variant="outline" size={size} defaultValue="grid" aria-label={`View, size ${size}`}>
          <ToggleGroupItem value="grid">Grid</ToggleGroupItem>
          <ToggleGroupItem value="list">List</ToggleGroupItem>
        </ToggleGroup>
      ))}
    </>
  )
}
