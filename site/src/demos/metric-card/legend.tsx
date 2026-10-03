import { LegendDot, MetricCard } from 'ferry-ui'

// Requests for each hour, in thousands.
const REQUESTS = [42, 38, 31, 26, 22, 24, 35, 58, 74, 88, 92, 86, 95, 99, 93, 80, 64, 49]

export default function MetricCardLegend() {
  const peak = Math.max(...REQUESTS)

  return (
    <MetricCard
      className="w-full max-w-sm"
      label="API requests"
      value="1.1M"
      hint="Last 18 hours"
      aside={<LegendDot tone="brand">Requests</LegendDot>}
    >
      <div
        role="img"
        aria-label={`Requests for each hour. The peak is ${peak}k.`}
        className="flex h-12 items-end gap-1"
      >
        {REQUESTS.map((count, index) => (
          <span key={index} className="flex-1 rounded-sm bg-brand" style={{ height: `${(count / peak) * 100}%` }} />
        ))}
      </div>
    </MetricCard>
  )
}
