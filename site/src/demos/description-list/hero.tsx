import { DescriptionItem, DescriptionList, StatusBadge } from '@roger.b/libui'

export default function DescriptionListHero() {
  return (
    <DescriptionList aria-label="Order details">
      <DescriptionItem label="Order" mono>
        ORD-58213
      </DescriptionItem>
      <DescriptionItem label="Status">
        <StatusBadge tone="success" label="Fulfilled" />
      </DescriptionItem>
      <DescriptionItem label="Customer">Acme</DescriptionItem>
      <DescriptionItem label="Payment">Bank transfer</DescriptionItem>
      <DescriptionItem label="Placed">Mar 4, 2026</DescriptionItem>
      <DescriptionItem label="Shipped">Mar 5, 2026</DescriptionItem>
      <DescriptionItem label="Total">
        <span className="tabular">$1,284.00</span>
      </DescriptionItem>
      <DescriptionItem label="Tracking" mono>
        TRK-0123-4567
      </DescriptionItem>
    </DescriptionList>
  )
}
