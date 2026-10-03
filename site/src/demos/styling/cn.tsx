import * as React from 'react'
import { Checkbox, Label, cn } from 'libui'

const MEMBERS = [
  { id: 'maya', name: 'Maya Chen', role: 'Admin' },
  { id: 'sam', name: 'Sam Lee', role: 'Member' },
  { id: 'noor', name: 'Noor Haddad', role: 'Viewer' },
]

export default function MergeClasses() {
  const [selected, setSelected] = React.useState(['maya'])

  function toggle(id: string, checked: boolean) {
    setSelected((current) => (checked ? [...current, id] : current.filter((item) => item !== id)))
  }

  return (
    <ul className="w-full max-w-xs divide-y rounded-lg border bg-surface-100">
      {MEMBERS.map((member) => {
        const checked = selected.includes(member.id)
        return (
          <li key={member.id} className={cn('flex items-center justify-between gap-3 px-4 py-3', checked && 'bg-selection')}>
            <Label>
              <Checkbox checked={checked} onCheckedChange={(next) => toggle(member.id, next === true)} />
              {member.name}
            </Label>
            {/* The last class wins: `text-foreground` replaces `text-foreground-lighter`. */}
            <span className={cn('text-[13px] text-foreground-lighter', checked && 'text-foreground')}>{member.role}</span>
          </li>
        )
      })}
    </ul>
  )
}
