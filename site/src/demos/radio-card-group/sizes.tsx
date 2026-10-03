import { RadioCardGroup, type RadioCardOption } from 'libui'
import { Globe, Lock } from 'lucide-react'

const OPTIONS: RadioCardOption[] = [
  { value: 'private', label: 'Private', description: 'Only members can open it.', icon: <Lock /> },
  { value: 'public', label: 'Public', description: 'Each person with the link can read it.', icon: <Globe /> },
]

export default function RadioCardGroupSizes() {
  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-6">
      <RadioCardGroup aria-label="Visibility, large cards" size="lg" columns={2} defaultValue="private" options={OPTIONS} />
      <RadioCardGroup aria-label="Visibility, small cards" size="sm" columns={2} defaultValue="private" options={OPTIONS} />
    </div>
  )
}
