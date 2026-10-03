import * as React from 'react'
import { Label, MetricCard, MetricTrend, Switch, UsageBar } from '@roger.b/libui'

export default function MetricCardLoading() {
  // In an app, `loading` comes from the request that loads the numbers.
  const [loading, setLoading] = React.useState(true)

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Switch id="metrics-loading" checked={loading} onCheckedChange={setLoading} />
        <Label htmlFor="metrics-loading">Loading</Label>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <MetricCard
          label="Revenue"
          value="$48,200"
          trend={<MetricTrend>+12.5%</MetricTrend>}
          hint="Last 30 days"
          loading={loading}
        />
        <MetricCard label="Storage" value="46 GB" unit="of 50 GB" loading={loading}>
          <UsageBar value={loading ? null : 92} label="Storage used" />
        </MetricCard>
      </div>
    </div>
  )
}
