import { Field, RadioCardGroup, type RadioCardOption } from 'libui'
import { Globe, Lock, Users } from 'lucide-react'

const OPTIONS: RadioCardOption[] = [
  { value: 'private', label: 'Private', description: 'Only you can open this project.', icon: <Lock /> },
  { value: 'team', label: 'Team', description: 'Each member of the workspace can open it.', icon: <Users /> },
  { value: 'public', label: 'Public', description: 'Each person with the link can read it.', icon: <Globe /> },
]

export default function RadioCardGroupHero() {
  return (
    <Field
      label="Visibility"
      labelAs="span"
      hint="You can change the visibility later."
      className="mx-auto w-full max-w-md"
    >
      <RadioCardGroup defaultValue="team" options={OPTIONS} />
    </Field>
  )
}
