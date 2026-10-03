import { EmptyState } from 'libui'
import { Users } from 'lucide-react'

export default function EmptyStateSizes() {
  return (
    <div className="grid items-start gap-4 sm:grid-cols-3">
      <EmptyState size="sm" icon={<Users />} title="No members yet" description="Small, 24px of padding." />
      <EmptyState size="md" icon={<Users />} title="No members yet" description="Medium, 40px of padding." />
      <EmptyState size="lg" icon={<Users />} title="No members yet" description="Large, 64px of padding." />
    </div>
  )
}
