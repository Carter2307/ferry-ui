import * as React from 'react'
import { Badge, Button, InnerMenu, toast, type NavGroup } from '@roger.b/libui'
import { Plug, Settings2, Users } from 'lucide-react'

const GROUPS: NavGroup[] = [
  {
    id: 'project',
    items: [
      { id: 'general', label: 'General', icon: <Settings2 /> },
      { id: 'members', label: 'Members', icon: <Users /> },
      { id: 'integrations', label: 'Integrations', icon: <Plug /> },
    ],
  },
]

export default function InnerMenuHeaderFooter() {
  const [section, setSection] = React.useState('general')

  return (
    <div className="flex h-dvh flex-col bg-background md:flex-row">
      <InnerMenu
        title="Project settings"
        groups={GROUPS}
        value={section}
        onValueChange={setSection}
        header={
          <div className="flex items-center justify-between gap-2 px-3">
            <span className="truncate text-sm text-foreground">Billing portal</span>
            <Badge font="mono">Pro</Badge>
          </div>
        }
        footer={
          <div className="flex flex-col items-start gap-2 rounded-lg border border-dashed p-3">
            <p className="text-[13px] text-foreground-light">Do you have a question about a setting?</p>
            <Button size="tiny" onClick={() => toast('The support form opens here')}>
              Contact support
            </Button>
          </div>
        }
      />
      <div className="min-w-0 flex-1 bg-dot-grid" />
    </div>
  )
}
