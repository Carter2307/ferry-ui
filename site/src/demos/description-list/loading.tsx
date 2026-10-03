import * as React from 'react'
import { DescriptionItem, DescriptionList, Label, Switch } from '@roger.b/libui'

export default function DescriptionListLoading() {
  // In an app, `loading` comes from the request that loads the record.
  const [loading, setLoading] = React.useState(true)

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Switch id="customer-loading" checked={loading} onCheckedChange={setLoading} />
        <Label htmlFor="customer-loading">Loading</Label>
      </div>
      <DescriptionList aria-label="Customer details">
        <DescriptionItem label="Customer" loading={loading}>
          Acme
        </DescriptionItem>
        <DescriptionItem label="Plan" loading={loading}>
          Business
        </DescriptionItem>
        <DescriptionItem label="Owner" loading={loading}>
          Maya Chen
        </DescriptionItem>
        <DescriptionItem label="Customer since" loading={loading}>
          Mar 4, 2024
        </DescriptionItem>
      </DescriptionList>
    </div>
  )
}
