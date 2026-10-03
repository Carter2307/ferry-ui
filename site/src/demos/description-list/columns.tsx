import { DescriptionItem, DescriptionList } from '@roger.b/libui'

export default function DescriptionListColumns() {
  return (
    <div className="flex flex-col gap-6">
      <DescriptionList columns={2} aria-label="Project">
        <DescriptionItem label="Owner">Maya Chen</DescriptionItem>
        <DescriptionItem label="Visibility">Private</DescriptionItem>
      </DescriptionList>
      <DescriptionList columns={3} aria-label="Subscription">
        <DescriptionItem label="Plan">Business</DescriptionItem>
        <DescriptionItem label="Seats">18 of 25</DescriptionItem>
        <DescriptionItem label="Renews">Apr 1, 2026</DescriptionItem>
      </DescriptionList>
    </div>
  )
}
