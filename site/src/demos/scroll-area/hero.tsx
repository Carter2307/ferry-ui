import { ScrollArea } from 'libui'

const ENTRIES = [
  'Maya Chen invited Jonas Weber',
  'Invoice INV-2041 paid',
  'Jonas Weber joined the workspace',
  'API key "Production backend" created',
  'Project Atlas renamed to Beacon',
  'Priya Patel changed the plan to Pro',
  'Invoice INV-2042 sent to Acme',
  'Order ORD-10482 shipped',
  'Maya Chen changed the role of Lucas Martin',
  'API key "Staging" revoked',
  'Invoice INV-2043 is overdue',
  'Order ORD-10483 refunded',
  'Lucas Martin left the workspace',
  'Project Compass archived',
]

export default function ScrollAreaHero() {
  return (
    <ScrollArea
      className="h-64 w-full max-w-sm rounded-lg border bg-surface-100"
      viewportProps={{ tabIndex: 0, role: 'region', 'aria-label': 'Activity log' }}
    >
      <ul className="divide-y text-[13px] text-foreground-light">
        {ENTRIES.map((entry) => (
          <li key={entry} className="px-4 py-2.5">
            {entry}
          </li>
        ))}
      </ul>
    </ScrollArea>
  )
}
