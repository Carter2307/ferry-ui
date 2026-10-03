import { Label, RadioGroup, RadioGroupItem } from 'ferry-ui'

const ROLES = [
  { value: 'viewer', label: 'Viewer', description: 'Sees the projects and the reports.' },
  { value: 'member', label: 'Member', description: 'Creates and edits the projects of the workspace.' },
  { value: 'admin', label: 'Admin', description: 'Has full access, with billing and members.' },
]

export default function RadioGroupDescriptions() {
  return (
    <RadioGroup aria-label="Role" defaultValue="member" className="max-w-sm gap-4">
      {ROLES.map((role) => (
        <div key={role.value} className="flex items-start gap-2.5">
          <RadioGroupItem
            value={role.value}
            id={`role-${role.value}`}
            aria-describedby={`role-${role.value}-hint`}
            className="mt-0.5"
          />
          <div className="flex flex-col gap-0.5">
            <Label htmlFor={`role-${role.value}`}>{role.label}</Label>
            <p id={`role-${role.value}-hint`} className="text-[13px] text-foreground-light">
              {role.description}
            </p>
          </div>
        </div>
      ))}
    </RadioGroup>
  )
}
