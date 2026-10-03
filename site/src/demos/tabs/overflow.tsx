import { Tabs, TabsContent, TabsList, TabsTrigger } from 'ferry-ui'

// A value has no space: the tab and its panel use it in their `id`.
const SECTIONS = [
  { value: 'overview', label: 'Overview' },
  { value: 'profile', label: 'Profile' },
  { value: 'notifications', label: 'Notifications' },
  { value: 'security', label: 'Security' },
  { value: 'billing', label: 'Billing' },
  { value: 'members', label: 'Members' },
  { value: 'api-keys', label: 'API keys' },
  { value: 'audit-log', label: 'Audit log' },
]

export default function TabsOverflow() {
  return (
    <Tabs defaultValue="overview" className="w-full max-w-xs">
      <TabsList aria-label="Account settings">
        {SECTIONS.map((section) => (
          <TabsTrigger key={section.value} value={section.value}>
            {section.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {SECTIONS.map((section) => (
        <TabsContent key={section.value} value={section.value} className="text-[13px] text-foreground-light">
          The panel of the tab "{section.label}".
        </TabsContent>
      ))}
    </Tabs>
  )
}
