import { MetricCard, MetricTrend, UsageBar } from '@roger.b/libui'

export default function MetricCardHero() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <MetricCard label="Revenue" value="$48,200" trend={<MetricTrend>+12.5%</MetricTrend>} hint="Last 30 days" />
      <MetricCard
        label="Active users"
        value="3,912"
        trend={<MetricTrend direction="down">-2.1%</MetricTrend>}
        hint="Last 7 days"
      />
      <MetricCard label="Orders" value="1,284" hint="Last 30 days" />
      <MetricCard label="Storage" value="46 GB" unit="of 50 GB">
        <UsageBar value={92} label="Storage used" />
      </MetricCard>
    </div>
  )
}
