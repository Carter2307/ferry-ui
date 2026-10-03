import { MetricCard, MetricTrend } from 'libui-kit'

export default function MetricCardTrend() {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <MetricCard label="Revenue" value="$48,200" trend={<MetricTrend direction="up">+12.5%</MetricTrend>} />
      <MetricCard label="Open tickets" value="14" trend={<MetricTrend direction="flat">0.0%</MetricTrend>} />
      <MetricCard
        label="Churn rate"
        value="3.1%"
        trend={
          <MetricTrend direction="up" sentiment="negative">
            +0.4 pts
          </MetricTrend>
        }
      />
    </div>
  )
}
