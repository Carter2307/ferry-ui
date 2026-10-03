import { MetricCard, UsageBar } from 'libui'

const QUOTAS = [
  { label: 'API calls', value: '320k', unit: 'of 1M', percent: 32 },
  { label: 'Seats', value: '8', unit: 'of 10', percent: 80 },
  { label: 'Storage', value: '47 GB', unit: 'of 50 GB', percent: 94 },
]

export default function MetricCardUsage() {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {QUOTAS.map((quota) => (
        <MetricCard key={quota.label} label={quota.label} value={quota.value} unit={quota.unit}>
          <UsageBar value={quota.percent} label={`${quota.label} used`} />
        </MetricCard>
      ))}
    </div>
  )
}
