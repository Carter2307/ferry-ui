import { InfoTile, StatusBadge } from 'ferry-ui'
import { CreditCard, Globe, ShieldCheck, User } from 'lucide-react'

export default function InfoTileHero() {
  return (
    <div className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
      <InfoTile icon={<ShieldCheck />} label="Status" value={<StatusBadge tone="success" label="Active" />} />
      <InfoTile icon={<CreditCard />} label="Plan" value="Pro" hint="Renews on Nov 1, 2026" />
      <InfoTile icon={<User />} label="Owner" value="Maya Chen" hint="maya@example.com" />
      <InfoTile icon={<Globe />} label="Timezone" value="Europe/Paris" />
    </div>
  )
}
