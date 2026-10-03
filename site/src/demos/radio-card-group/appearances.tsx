import { RadioCardGroup, type RadioCardOption } from '@roger.b/libui'
import { Globe, Lock } from 'lucide-react'

const OPTIONS: RadioCardOption[] = [
  { value: 'private', label: 'Private', description: 'Only members can open it.', icon: <Lock /> },
  { value: 'public', label: 'Public', description: 'Each person with the link can read it.', icon: <Globe /> },
]

export default function RadioCardGroupAppearances() {
  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-6">
      <RadioCardGroup aria-label="Visibility, outline" appearance="outline" size="sm" columns={2} defaultValue="private" options={OPTIONS} />
      <RadioCardGroup aria-label="Visibility, soft" appearance="soft" size="sm" columns={2} defaultValue="private" options={OPTIONS} />
    </div>
  )
}
