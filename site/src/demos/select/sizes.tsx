import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@roger.b/libui'

const SIZES = ['tiny', 'sm', 'md'] as const

export default function SelectSizes() {
  return (
    <>
      {SIZES.map((size) => (
        <Select key={size} defaultValue="30d">
          <SelectTrigger size={size} aria-label={`Date range, size ${size}`}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="24h">Last 24 hours</SelectItem>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
          </SelectContent>
        </Select>
      ))}
    </>
  )
}
