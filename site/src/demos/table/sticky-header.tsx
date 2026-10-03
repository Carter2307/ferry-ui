import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from 'libui'

const ACTORS = ['Maya Chen', 'Jonas Weber', 'Priya Patel', 'System']
const ACTIONS = ['member.invited', 'invoice.paid', 'api_key.created', 'project.renamed', 'role.updated']
const TARGETS = ['Atlas', 'INV-2043', 'Production backend', 'Beacon', 'Compass']

const EVENTS = Array.from({ length: 24 }, (_, index) => ({
  id: `evt_${1000 + index}`,
  time: `16:${String(59 - index).padStart(2, '0')}`,
  actor: ACTORS[index % ACTORS.length],
  action: ACTIONS[index % ACTIONS.length],
  target: TARGETS[index % TARGETS.length],
}))

export default function TableStickyHeader() {
  return (
    <Table
      aria-label="Audit log"
      // The container has a maximum height: it scrolls, and the keyboard can reach it.
      containerClassName="max-h-80"
      containerProps={{ tabIndex: 0, role: 'region', 'aria-label': 'Audit log, scrollable' }}
    >
      {/* The inset shadow draws the line below the header: a border does not move with a sticky header. */}
      <TableHeader className="sticky top-0 z-10 bg-surface-100 [&_th]:shadow-[inset_0_-1px_0_var(--border)]">
        <TableRow className="bg-surface-200 hover:bg-surface-200">
          <TableHead>Time</TableHead>
          <TableHead>Actor</TableHead>
          <TableHead>Event</TableHead>
          <TableHead>Target</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {EVENTS.map((event) => (
          <TableRow key={event.id}>
            <TableCell className="font-mono text-[13px] text-foreground-light tabular">{event.time}</TableCell>
            <TableCell>{event.actor}</TableCell>
            <TableCell className="font-mono text-[13px]">{event.action}</TableCell>
            <TableCell className="text-foreground-light">{event.target}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
