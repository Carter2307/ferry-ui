import * as React from 'react'
import { Checkbox, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from 'libui-kit'

const API_KEYS = [
  { id: 'k1', name: 'Production backend', scope: 'Read and write', lastUsed: '2 minutes ago' },
  { id: 'k2', name: 'Analytics export', scope: 'Read only', lastUsed: '3 hours ago' },
  { id: 'k3', name: 'Staging', scope: 'Read and write', lastUsed: '2 days ago' },
]

export default function TableSelection() {
  const [selected, setSelected] = React.useState<string[]>(['k2'])

  function toggle(id: string, checked: boolean) {
    setSelected((current) => (checked ? [...current, id] : current.filter((key) => key !== id)))
  }

  return (
    <Table aria-label="API keys">
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead className="w-10">
            <Checkbox
              aria-label="Select all keys"
              checked={selected.length === API_KEYS.length}
              onCheckedChange={(checked) => setSelected(checked === true ? API_KEYS.map((key) => key.id) : [])}
            />
          </TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Scope</TableHead>
          <TableHead>Last used</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {API_KEYS.map((key) => {
          const isSelected = selected.includes(key.id)
          return (
            <TableRow key={key.id} data-state={isSelected ? 'selected' : undefined}>
              <TableCell>
                <Checkbox
                  aria-label={`Select ${key.name}`}
                  checked={isSelected}
                  onCheckedChange={(checked) => toggle(key.id, checked === true)}
                />
              </TableCell>
              <TableCell className="font-medium">{key.name}</TableCell>
              <TableCell>{key.scope}</TableCell>
              <TableCell className="text-foreground-light">{key.lastUsed}</TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}
