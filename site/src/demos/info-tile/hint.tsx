import { InfoTile } from 'libui'
import { CalendarDays, CreditCard } from 'lucide-react'

export default function InfoTileHint() {
  return (
    <div className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
      <InfoTile icon={<CreditCard />} label="Plan" value="Pro" hint="8 of 10 seats used" />
      <InfoTile icon={<CalendarDays />} label="Next invoice" value="Nov 1, 2026" />
    </div>
  )
}
