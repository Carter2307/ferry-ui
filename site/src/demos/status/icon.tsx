import { StatusBadge } from 'libui-kit'
import { CreditCard, Lock, ShieldAlert } from 'lucide-react'

export default function StatusIcon() {
  return (
    <>
      <StatusBadge tone="destructive" icon={<ShieldAlert />} label="Blocked" />
      <StatusBadge tone="neutral" icon={<Lock />} label="Private" />
      <StatusBadge tone="warning" icon={<CreditCard />} label="Card expires" dot />
      <StatusBadge tone="neutral" label="Draft" dot={false} />
    </>
  )
}
