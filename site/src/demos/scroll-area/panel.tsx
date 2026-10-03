import { ScrollArea } from 'libui-kit'

const NOTIFICATIONS = [
  { who: 'Maya Chen', what: 'added a comment on the invoice INV-2041', when: '2 min' },
  { who: 'Jonas Weber', what: 'invited you to the project Beacon', when: '14 min' },
  { who: 'Priya Patel', what: 'marked the invoice INV-2042 as paid', when: '1 h' },
  { who: 'Lucas Martin', what: 'gave you the task "Update the emails"', when: '3 h' },
  { who: 'Maya Chen', what: 'created a new API key', when: '5 h' },
  { who: 'Jonas Weber', what: 'changed the plan to Pro', when: 'Yesterday' },
  { who: 'Priya Patel', what: 'closed 6 tasks in the project Atlas', when: 'Yesterday' },
  { who: 'Lucas Martin', what: 'exported the orders of September', when: '2 d' },
]

export default function ScrollAreaPanel() {
  return (
    <div className="flex h-80 w-full max-w-xs flex-col overflow-hidden rounded-lg border bg-surface-100">
      {/* The header keeps its height. */}
      <div className="flex h-11 shrink-0 items-center justify-between border-b px-4">
        <span className="text-sm font-medium text-foreground">Notifications</span>
        <span className="tabular text-xs text-foreground-lighter">{NOTIFICATIONS.length} new</span>
      </div>
      {/* The area takes the height that stays free. */}
      <ScrollArea
        className="min-h-0 flex-1"
        viewportProps={{ tabIndex: 0, role: 'region', 'aria-label': 'Notifications' }}
      >
        <ul className="divide-y">
          {NOTIFICATIONS.map((notification) => (
            <li key={notification.what} className="flex flex-col gap-0.5 px-4 py-2.5">
              <span className="text-[13px] text-foreground-light">
                <span className="font-medium text-foreground">{notification.who}</span> {notification.what}
              </span>
              <span className="text-xs text-foreground-lighter">{notification.when}</span>
            </li>
          ))}
        </ul>
      </ScrollArea>
    </div>
  )
}
