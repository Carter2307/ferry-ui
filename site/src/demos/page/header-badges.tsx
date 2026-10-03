import { Badge, PageHeader } from 'libui-kit'

export default function PageHeaderBadges() {
  return (
    <PageHeader
      title="Usage reports"
      description="The API calls of each project, day by day."
      badges={<Badge variant="info">Beta</Badge>}
    />
  )
}
