import * as React from 'react'
import { RadioCardGroup, type RadioCardOption } from 'ferry-ui'
import { Globe, Lock } from 'lucide-react'

type Visibility = 'private' | 'public'

const OPTIONS: RadioCardOption<Visibility>[] = [
  { value: 'private', label: 'Private', description: 'Only invited members can open it.', icon: <Lock /> },
  { value: 'public', label: 'Public', description: 'Anyone with the link can view it.', icon: <Globe /> },
]

export default function GenericValue() {
  // `onValueChange` gives a `Visibility`, not a `string`.
  const [visibility, setVisibility] = React.useState<Visibility>('private')

  return (
    <RadioCardGroup
      aria-label="Visibility"
      className="w-full max-w-lg"
      columns={2}
      options={OPTIONS}
      value={visibility}
      onValueChange={setVisibility}
    />
  )
}
