import { DescriptionItem, DescriptionList } from 'ferry-ui'

export default function DescriptionListEmptyValues() {
  return (
    <DescriptionList aria-label="Task details">
      <DescriptionItem label="Assignee" />
      <DescriptionItem label="Due date">{null}</DescriptionItem>
      <DescriptionItem label="Notes">{''}</DescriptionItem>
      <DescriptionItem label="Open tasks">{0}</DescriptionItem>
    </DescriptionList>
  )
}
