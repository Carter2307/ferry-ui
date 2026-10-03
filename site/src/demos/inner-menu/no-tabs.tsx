import * as React from 'react'
import { InnerMenu, type NavGroup } from '@roger.b/libui'

const GROUPS: NavGroup[] = [
  {
    id: 'account',
    items: [
      { id: 'profile', label: 'Profile' },
      { id: 'notifications', label: 'Notifications' },
      { id: 'security', label: 'Security' },
    ],
  },
]

export default function InnerMenuNoTabs() {
  const [section, setSection] = React.useState('profile')

  return (
    // The container is a row at each width, because the menu stays on the side.
    <div className="flex h-dvh bg-background">
      <InnerMenu
        label="Account settings"
        groups={GROUPS}
        value={section}
        onValueChange={setSection}
        mobileTabs={false}
      />
      <div className="min-w-0 flex-1 bg-dot-grid" />
    </div>
  )
}
