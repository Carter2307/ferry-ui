import { DescriptionItem, DescriptionList } from '@roger.b/libui'

const ENDPOINT = 'https://hooks.example.com/v2/workspaces/acme/integrations/billing-events/receiver'

export default function DescriptionListLongValues() {
  return (
    <DescriptionList aria-label="Webhook details">
      <DescriptionItem label="Endpoint" mono span={2}>
        <span title={ENDPOINT}>{ENDPOINT}</span>
      </DescriptionItem>
      <DescriptionItem label="Events">invoice.paid</DescriptionItem>
      <DescriptionItem label="Last delivery">2 minutes ago</DescriptionItem>
      <DescriptionItem label="Description" span="full" wrap>
        Sends the paid invoices to the data warehouse of the finance team. A delivery that fails starts again for 24
        hours, then the billing channel gets an alert.
      </DescriptionItem>
    </DescriptionList>
  )
}
