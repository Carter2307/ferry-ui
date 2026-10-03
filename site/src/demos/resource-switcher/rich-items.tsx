import { ResourceSwitcher, StatusDot, type ResourceSwitcherItem } from 'ferry-ui'
import { UsersRound } from 'lucide-react'

const TEAMS: ResourceSwitcherItem[] = [
  {
    id: 'design',
    label: 'Design',
    icon: <UsersRound />,
    description: '8 members, Pro plan',
    meta: <StatusDot tone="success" label="Active" />,
  },
  {
    id: 'engineering',
    label: 'Engineering',
    icon: <UsersRound />,
    description: '24 members, Pro plan',
    // The query "developers" finds this team.
    keywords: ['developers'],
    meta: <StatusDot tone="success" label="Active" />,
  },
  {
    id: 'growth',
    label: 'Growth',
    icon: <UsersRound />,
    description: '5 members, trial ends in 3 days',
    meta: <StatusDot tone="warning" label="Trial" />,
  },
  { id: 'support', label: 'Support', icon: <UsersRound />, description: 'Archived team', disabled: true },
]

export default function ResourceSwitcherRichItems() {
  // Uncontrolled: the component holds the current team.
  return <ResourceSwitcher label="switch team" heading="Teams" items={TEAMS} defaultValue="engineering" />
}
