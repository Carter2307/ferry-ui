import * as React from 'react'
import { Checkbox, Label } from '@roger.b/libui'

const MEMBERS = [
  { id: 'maya', name: 'Maya Chen' },
  { id: 'sam', name: 'Sam Lee' },
  { id: 'nora', name: 'Nora Diaz' },
]

export default function CheckboxSelectAll() {
  const [selected, setSelected] = React.useState(['maya'])
  const all = selected.length === MEMBERS.length
  const some = selected.length > 0 && !all

  function toggle(id: string, checked: boolean) {
    setSelected((current) => (checked ? [...current, id] : current.filter((item) => item !== id)))
  }

  return (
    <div className="flex w-full max-w-xs flex-col divide-y rounded-lg border bg-surface-100">
      <Label className="px-4 py-2.5">
        <Checkbox
          checked={all ? true : some ? 'indeterminate' : false}
          onCheckedChange={(checked) => setSelected(checked === true ? MEMBERS.map((member) => member.id) : [])}
        />
        All members
      </Label>
      {MEMBERS.map((member) => (
        <Label key={member.id} className="px-4 py-2.5 font-normal">
          <Checkbox
            checked={selected.includes(member.id)}
            onCheckedChange={(checked) => toggle(member.id, checked === true)}
          />
          {member.name}
        </Label>
      ))}
    </div>
  )
}
