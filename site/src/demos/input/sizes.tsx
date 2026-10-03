import { Input } from '@roger.b/libui'

export default function InputSizes() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-3">
      <Input size="tiny" placeholder="Tiny, 26px" aria-label="Tiny input" />
      <Input size="sm" placeholder="Small, 30px" aria-label="Small input" />
      <Input size="md" placeholder="Medium, 34px" aria-label="Medium input" />
      <Input size="lg" placeholder="Large, 38px" aria-label="Large input" />
    </div>
  )
}
