import { Callout, Card, CardAction, CardHeader, CardTitle, StatusBadge } from 'libui-kit'

const EVENTS = [
  { who: 'Maya Chen', what: 'approved invoice INV-2041', when: '2 min ago' },
  { who: 'Liam Novak', what: 'invited a member to Billing', when: '14 min ago' },
  { who: 'Ines Duarte', what: 'created an API key', when: '1 h ago' },
]

export default function CalloutBanner() {
  return (
    <Card className="w-full max-w-xl">
      <CardHeader>
        <CardTitle>Activity</CardTitle>
        <CardAction>
          <StatusBadge tone="neutral" label="Paused" size="sm" />
        </CardAction>
      </CardHeader>
      <Callout variant="banner" tone="destructive">
        The live feed has no connection. New events do not show.
      </Callout>
      <ul className="divide-y text-[13px]">
        {EVENTS.map((event) => (
          <li key={event.what} className="flex items-center justify-between gap-4 px-5 py-2.5 md:px-6">
            <span className="min-w-0 truncate text-foreground-light">
              <span className="font-medium text-foreground">{event.who}</span> {event.what}
            </span>
            <span className="shrink-0 text-foreground-lighter">{event.when}</span>
          </li>
        ))}
      </ul>
    </Card>
  )
}
