import { Badge, Button, Card, CardContent, PageContainer, PageHeader, PageSection } from 'libui'
import { UserPlus } from 'lucide-react'

const MEMBERS = [
  { name: 'Maya Chen', email: 'maya@example.com', role: 'Owner' },
  { name: 'Jonas Weber', email: 'jonas@example.com', role: 'Admin' },
  { name: 'Priya Patel', email: 'priya@example.com', role: 'Member' },
]

export default function PageHero() {
  return (
    <div className="rounded-lg border">
      <PageContainer size="narrow">
        <PageHeader
          title="Members"
          description="People with access to this workspace."
          actions={
            <Button variant="primary" icon={<UserPlus />}>
              Invite member
            </Button>
          }
        />
        <PageSection title="Active members" description="They can sign in today.">
          <Card className="divide-y">
            {MEMBERS.map((member) => (
              <CardContent key={member.email} className="flex items-center justify-between gap-4">
                <div className="flex min-w-0 flex-col">
                  <span className="truncate text-sm text-foreground">{member.name}</span>
                  <span className="truncate text-[13px] text-foreground-light">{member.email}</span>
                </div>
                <Badge>{member.role}</Badge>
              </CardContent>
            ))}
          </Card>
        </PageSection>
        <PageSection title="Pending invitations" description="An invitation stays valid for 7 days.">
          <Card>
            <CardContent className="text-[13px] text-foreground-light">No invitation is pending.</CardContent>
          </Card>
        </PageSection>
      </PageContainer>
    </div>
  )
}
