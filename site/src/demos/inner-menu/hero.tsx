import * as React from 'react'
import { InnerMenu, PageContainer, PageHeader, type NavGroup } from 'libui-kit'
import { BellRing, CreditCard, KeyRound, ShieldCheck, User, Users } from 'lucide-react'

const GROUPS: NavGroup[] = [
  {
    id: 'account',
    label: 'Account',
    items: [
      { id: 'profile', label: 'Profile', icon: <User /> },
      { id: 'notifications', label: 'Notifications', icon: <BellRing /> },
      { id: 'security', label: 'Security', icon: <ShieldCheck /> },
    ],
  },
  {
    id: 'workspace',
    label: 'Workspace',
    items: [
      { id: 'members', label: 'Members', icon: <Users /> },
      { id: 'billing', label: 'Billing', icon: <CreditCard /> },
      { id: 'api-keys', label: 'API keys', icon: <KeyRound /> },
    ],
  },
]

export default function InnerMenuHero() {
  // The menu does not render the sections. Your state (or your router) holds the current one.
  const [section, setSection] = React.useState('profile')
  const current = GROUPS.flatMap((group) => group.items).find((item) => item.id === section)

  return (
    <div className="flex h-dvh flex-col bg-background md:flex-row">
      <InnerMenu title="Settings" groups={GROUPS} value={section} onValueChange={setSection} />
      <div className="min-w-0 flex-1 overflow-y-auto">
        <PageContainer size="narrow">
          <PageHeader title={current?.label} description="The menu selects the section that shows here." />
        </PageContainer>
      </div>
    </div>
  )
}
