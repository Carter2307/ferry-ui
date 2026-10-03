import { InfoTile } from 'ferry-ui'
import { Globe } from 'lucide-react'

const WEBSITE = 'www.acme-customer-portal.example.com'

export default function InfoTileLongValue() {
  return (
    <InfoTile
      className="w-full max-w-xs"
      icon={<Globe />}
      label="Website"
      value={<span title={WEBSITE}>{WEBSITE}</span>}
      hint="This address shows on each invoice and in each email to a customer."
    />
  )
}
