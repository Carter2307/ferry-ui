import { StatusBadge } from 'ferry-ui'

export default function StatusSizes() {
  return (
    <div className="flex flex-col gap-4">
      <StatusBadge tone="success" label="Active" />
      <div className="flex items-center gap-2">
        <span className="text-base font-medium text-foreground">Billing portal</span>
        <StatusBadge tone="success" label="Active" size="sm" />
      </div>
    </div>
  )
}
