import { Button, PageHeader, Tabs, TabsList, TabsTrigger } from 'ferry-ui'
import { UserPlus } from 'lucide-react'

export default function PageHeaderTabs() {
  return (
    <PageHeader
      title="Team"
      description="The people who can open this workspace."
      actions={
        <Button variant="primary" icon={<UserPlus />}>
          Invite member
        </Button>
      }
    >
      <Tabs defaultValue="members">
        <TabsList aria-label="Team sections">
          <TabsTrigger value="members">Members</TabsTrigger>
          <TabsTrigger value="invitations">Invitations</TabsTrigger>
          <TabsTrigger value="roles">Roles</TabsTrigger>
        </TabsList>
      </Tabs>
    </PageHeader>
  )
}
