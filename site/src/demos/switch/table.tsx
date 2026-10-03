import { Switch, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from 'libui-kit'

const API_KEYS = [
  { id: 'production', name: 'Production', created: 'Mar 4, 2026', enabled: true },
  { id: 'staging', name: 'Staging', created: 'Jan 12, 2026', enabled: true },
  { id: 'local', name: 'Local tests', created: 'Nov 30, 2025', enabled: false },
]

export default function SwitchTable() {
  return (
    <Table aria-label="API keys">
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead>Name</TableHead>
          <TableHead>Created</TableHead>
          <TableHead className="w-[1%]">Enabled</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {API_KEYS.map((key) => (
          <TableRow key={key.id}>
            <TableCell>{key.name}</TableCell>
            <TableCell>{key.created}</TableCell>
            <TableCell>
              <Switch size="sm" defaultChecked={key.enabled} aria-label={`Enable the ${key.name} key`} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
