import { Card, CardContent, CardHeader, CardTitle, EmptyState } from 'ferry-ui'
import { History } from 'lucide-react'

export default function EmptyStateInCard() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Recent activity</CardTitle>
      </CardHeader>
      <CardContent>
        <EmptyState
          variant="plain"
          size="sm"
          icon={<History />}
          title="No activity yet"
          description="Edits, comments and invitations show here."
        />
      </CardContent>
    </Card>
  )
}
