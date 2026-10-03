import { Card, CardContent, CardDescription, CardHeader, CardTitle, DescriptionItem, DescriptionList } from '@roger.b/libui'

export default function DescriptionListStrip() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <div>
          <CardTitle>Design team</CardTitle>
          <CardDescription>The workspace for product design.</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="text-[13px] text-foreground-light">
        The brand assets and the component library are here.
      </CardContent>
      <DescriptionList variant="strip" columns={3} aria-label="Team details">
        <DescriptionItem label="Members">12</DescriptionItem>
        <DescriptionItem label="Projects">7</DescriptionItem>
        <DescriptionItem label="Team ID" mono>
          tm_42
        </DescriptionItem>
      </DescriptionList>
    </Card>
  )
}
