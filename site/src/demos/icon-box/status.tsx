import type { ReactNode } from 'react'
import { IconBox, type IconBoxTone } from 'libui'
import { AlertTriangle, CreditCard, Receipt, UserPlus } from 'lucide-react'

const EVENTS: { tone: IconBoxTone; icon: ReactNode; title: string; meta: string }[] = [
  { tone: 'success', icon: <Receipt />, title: 'Invoice INV-2041 paid', meta: '2 hours ago' },
  { tone: 'info', icon: <UserPlus />, title: 'Maya Chen is now a member', meta: '5 hours ago' },
  { tone: 'warning', icon: <CreditCard />, title: 'The card expires this month', meta: 'Yesterday' },
  { tone: 'destructive', icon: <AlertTriangle />, title: 'Webhook delivery failed', meta: 'Yesterday' },
]

export default function IconBoxStatus() {
  return (
    <ul className="flex w-full max-w-sm flex-col gap-4">
      {EVENTS.map((event) => (
        <li key={event.title} className="flex items-center gap-3">
          <IconBox size="sm" tone={event.tone}>
            {event.icon}
          </IconBox>
          <span className="flex min-w-0 flex-col">
            <span className="truncate text-[13px] text-foreground">{event.title}</span>
            <span className="text-[13px] text-foreground-lighter">{event.meta}</span>
          </span>
        </li>
      ))}
    </ul>
  )
}
