import { MetricCard } from 'libui-kit'

export default function MetricCardCompact() {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <MetricCard compact label="Open tickets" value="14" />
      <MetricCard compact label="First reply" value="1h 12m" />
      <MetricCard compact label="Satisfaction" value="96%" />
    </div>
  )
}
