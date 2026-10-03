import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from 'libui-kit'

const PROJECTS = [
  {
    name: 'Atlas',
    description: 'New first steps for customers, with a guided setup, sample data and a progress bar',
    tasks: 128,
  },
  { name: 'Beacon', description: 'Invoices that follow the usage of each customer', tasks: 42 },
  { name: 'Compass', description: 'Dashboards for the sales team and the support team', tasks: 7 },
]

export default function TableColumns() {
  return (
    <Table aria-label="Projects">
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead>Project</TableHead>
          <TableHead>Description</TableHead>
          <TableHead className="text-right">Open tasks</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {PROJECTS.map((project) => (
          <TableRow key={project.name}>
            <TableCell className="font-medium">{project.name}</TableCell>
            {/* This column takes the free width. Its text does not push the table wider. */}
            <TableCell className="w-full max-w-0 text-foreground-light">
              <span className="block truncate" title={project.description}>
                {project.description}
              </span>
            </TableCell>
            <TableCell className="text-right tabular">{project.tasks}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
