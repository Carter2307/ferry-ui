import { MetricCard } from 'libui-kit'

export default function MetricCardInfo() {
  return (
    <MetricCard
      className="w-full max-w-xs"
      label="Error rate"
      value="0.42%"
      hint="Last 24 hours"
      info="The share of API requests that failed."
      infoLabel="About the error rate"
    />
  )
}
