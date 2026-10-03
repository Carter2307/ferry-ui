import { Table, TableBody, TableHead, TableHeader, TableMessageRow, TableRow } from 'ferry-ui'

export default function TableStatesEmpty() {
  return (
    <Table aria-label="API keys">
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead>Name</TableHead>
          <TableHead>Key</TableHead>
          <TableHead>Created</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableMessageRow colSpan={3}>No API keys yet. Create a key to call the API from your code.</TableMessageRow>
      </TableBody>
    </Table>
  )
}
