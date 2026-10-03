import * as React from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, rowLinkProps } from 'libui-kit'

const PROJECTS = [
  { id: 'atlas', name: 'Atlas', owner: 'Maya Chen', updated: '5 minutes ago' },
  { id: 'beacon', name: 'Beacon', owner: 'Jonas Weber', updated: 'Yesterday' },
  { id: 'compass', name: 'Compass', owner: 'Priya Patel', updated: 'Aug 2, 2026' },
]

const LINK =
  'rounded-sm font-medium underline-offset-4 outline-none hover:underline focus-visible:ring-2 focus-visible:ring-ring'

export default function TableClickableRows() {
  // In an app, the row and the link go to the page of the project.
  const [opened, setOpened] = React.useState<string>()

  return (
    <div className="flex flex-col gap-3">
      <Table aria-label="Projects">
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead>Project</TableHead>
            <TableHead>Owner</TableHead>
            <TableHead>Updated</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {PROJECTS.map((project) => (
            <TableRow key={project.id} {...rowLinkProps(() => setOpened(project.name))}>
              <TableCell>
                <a
                  href={`#${project.id}`}
                  onClick={(event) => {
                    event.preventDefault()
                    setOpened(project.name)
                  }}
                  className={LINK}
                >
                  {project.name}
                </a>
              </TableCell>
              <TableCell className="text-foreground-light">{project.owner}</TableCell>
              <TableCell className="text-foreground-light">{project.updated}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <p className="text-[13px] text-foreground-light" aria-live="polite">
        {opened ? `Opened: ${opened}` : 'Click a row to open a project.'}
      </p>
    </div>
  )
}
