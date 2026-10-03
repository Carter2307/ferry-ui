import { Button, Popover, PopoverContent, PopoverTrigger } from 'libui'
import { Bell } from 'lucide-react'

const NOTIFICATIONS = [
  { id: 1, text: 'Acme paid the invoice INV-2041.', when: '2 min ago' },
  { id: 2, text: 'Sam Lee joined the workspace.', when: '1 hour ago' },
  { id: 3, text: 'The API key “Analytics export” expires in 3 days.', when: 'Yesterday' },
]

export default function PopoverCustomSize() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" icon={<Bell />} aria-label="Notifications" />
      </PopoverTrigger>
      {/* `w-80 p-0`: a wider panel with no padding, for a list that touches the edges. */}
      <PopoverContent align="end" className="w-80 p-0" aria-label="Notifications">
        <ul className="divide-y">
          {NOTIFICATIONS.map((notification) => (
            <li key={notification.id} className="flex flex-col gap-0.5 px-4 py-2.5">
              <span className="text-[13px] text-foreground">{notification.text}</span>
              <span className="text-xs text-foreground-lighter">{notification.when}</span>
            </li>
          ))}
        </ul>
        <div className="border-t p-2">
          <Button variant="ghost" className="w-full">
            Mark all as read
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
