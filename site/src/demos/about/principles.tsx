import {
  Button,
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  DescriptionItem,
  DescriptionList,
  StatusBadge,
} from 'libui'

export default function Principles() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <div>
          <CardTitle className="flex items-center gap-2">
            Acme production
            <StatusBadge tone="success" label="Active" size="sm" />
          </CardTitle>
          <CardDescription>Customer billing</CardDescription>
        </div>
        <CardAction>
          <Button>Export</Button>
          <Button variant="primary">Open project</Button>
        </CardAction>
      </CardHeader>
      <CardContent className="text-[13px] text-foreground-light">
        The project sends the invoices of 12 customers on the first day of each month.
      </CardContent>
      <DescriptionList variant="strip" columns={3} aria-label="Project facts">
        <DescriptionItem label="Region" mono>
          eu-west
        </DescriptionItem>
        <DescriptionItem label="Members">8</DescriptionItem>
        <DescriptionItem label="Open invoices">4</DescriptionItem>
      </DescriptionList>
    </Card>
  )
}
