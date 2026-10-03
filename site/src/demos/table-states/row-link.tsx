import * as React from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, rowLinkProps } from '@roger.b/libui'

const MEMBERS = [
  { id: 'maya', name: 'Maya Chen', role: 'Owner' },
  { id: 'jonas', name: 'Jonas Weber', role: 'Admin' },
  { id: 'priya', name: 'Priya Patel', role: 'Member' },
]

export default function TableStatesRowLink() {
  // In an app, the row and the link go to the page of the member.
  const [opened, setOpened] = React.useState<string>()

  return (
    <div className="flex flex-col gap-3">
      <Table aria-label="Members">
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead>Name</TableHead>
            <TableHead>Role</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {MEMBERS.map((member) => (
            <TableRow key={member.id} {...rowLinkProps(() => setOpened(member.name))}>
              <TableCell>
                <a
                  href={`#${member.id}`}
                  onClick={(event) => {
                    event.preventDefault()
                    setOpened(member.name)
                  }}
                  className="rounded-sm outline-none hover:underline focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {member.name}
                </a>
              </TableCell>
              <TableCell className="text-foreground-light">{member.role}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <p className="text-[13px] text-foreground-light" aria-live="polite">
        {opened ? `Opened: ${opened}` : 'Click a row to open a member.'}
      </p>
    </div>
  )
}
