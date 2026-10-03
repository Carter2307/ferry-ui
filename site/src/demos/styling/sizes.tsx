import { Button, Input } from 'ferry-ui'

const SIZES = [
  { size: 'tiny', height: '26px' },
  { size: 'sm', height: '30px' },
  { size: 'md', height: '34px' },
  { size: 'lg', height: '38px' },
] as const

export default function ControlSizes() {
  return (
    <div className="flex flex-col gap-3">
      {SIZES.map(({ size, height }) => (
        <div key={size} className="flex items-center gap-2">
          <span className="w-20 font-mono text-xs text-foreground-lighter">
            {size}, {height}
          </span>
          <Input size={size} aria-label={`Coupon code, size ${size}`} placeholder="Coupon code" className="w-40" />
          <Button size={size}>Apply</Button>
        </div>
      ))}
    </div>
  )
}
