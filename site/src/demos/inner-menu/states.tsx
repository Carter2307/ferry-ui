import * as React from 'react'
import { Badge, InnerMenu, type NavGroup } from 'libui-kit'

const GROUPS: NavGroup[] = [
  {
    id: 'reports',
    label: 'Reports',
    items: [
      { id: 'revenue', label: 'Weekly revenue by region and sales channel' },
      { id: 'invoices', label: 'Invoices', badge: <Badge variant="info">12</Badge> },
      { id: 'forecast', label: 'Forecast', badge: <Badge variant="warning">Beta</Badge> },
      { id: 'exports', label: 'Scheduled exports', disabled: true },
    ],
  },
]

export default function InnerMenuStates() {
  const [section, setSection] = React.useState('revenue')

  return (
    <div className="flex h-dvh flex-col bg-background md:flex-row">
      <InnerMenu title="Analytics" groups={GROUPS} value={section} onValueChange={setSection} />
      <div className="min-w-0 flex-1 bg-dot-grid" />
    </div>
  )
}
