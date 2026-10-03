import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  toast,
} from 'ferry-ui'
import { MoreHorizontal } from 'lucide-react'

const MEMBERS = [
  { name: 'Maya Chen', role: 'Owner' },
  { name: 'Jonas Weber', role: 'Admin' },
  { name: 'Priya Patel', role: 'Member' },
]

export default function TableRowActions() {
  return (
    <Table aria-label="Members">
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead>Name</TableHead>
          <TableHead>Role</TableHead>
          <TableHead className="w-[1%]">
            <span className="sr-only">Actions</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {MEMBERS.map(({ name, role }) => (
          <TableRow key={name}>
            <TableCell className="font-medium">{name}</TableCell>
            <TableCell>{role}</TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon-tiny" icon={<MoreHorizontal />} aria-label={`Actions for ${name}`} />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-44">
                  <DropdownMenuItem onSelect={() => toast('Role changed')}>Change role</DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => toast('Invitation sent')}>Send an invitation</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
