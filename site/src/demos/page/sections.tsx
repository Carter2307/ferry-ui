import { Badge, Button, Card, CardContent, PageSection } from 'libui'
import { Plus } from 'lucide-react'

export default function PageSections() {
  return (
    <div>
      <PageSection
        id="payment-methods"
        title="Payment methods"
        description="The default card pays the invoice of each month."
        actions={
          <Button size="tiny" icon={<Plus />}>
            Add card
          </Button>
        }
      >
        <Card>
          <CardContent className="flex items-center justify-between gap-4 text-sm">
            <span className="text-foreground">Card with the last digits 4242</span>
            <Badge>Default</Badge>
          </CardContent>
        </Card>
      </PageSection>
      <PageSection id="billing-address" title="Billing address">
        <Card>
          <CardContent className="text-sm text-foreground">Acme, 12 Harbor Street, Portland</CardContent>
        </Card>
      </PageSection>
    </div>
  )
}
