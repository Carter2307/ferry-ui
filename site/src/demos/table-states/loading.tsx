import { Table, TableBody, TableHead, TableHeader, TableRow, TableSkeletonRows } from '@roger.b/libui'

export default function TableStatesLoading() {
  return (
    <Table aria-label="Members">
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Role</TableHead>
          <TableHead className="text-right">Projects</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody aria-busy="true">
        <TableSkeletonRows columns={4} rows={3} />
      </TableBody>
    </Table>
  )
}
