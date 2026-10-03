import { MetricTrend, StatusBadge, StatusDot, UsageBar } from '@roger.b/libui'

export default function StatusWithText() {
  return (
    <div className="flex w-full max-w-xs flex-col gap-4 text-[13px] text-foreground-light">
      <div className="flex items-center justify-between">
        Invoice INV-2041
        <StatusBadge tone="destructive" label="Overdue" />
      </div>
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-2">
          <StatusDot tone="success" /> 3 endpoints online
        </span>
        <StatusDot tone="warning" label="1 endpoint degraded" />
      </div>
      <div className="flex items-center justify-between">
        Revenue
        <MetricTrend>+12.5%</MetricTrend>
      </div>
      <UsageBar value={82} label="Storage used" />
    </div>
  )
}
