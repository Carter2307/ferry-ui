import { Card, CardHeader, CardTitle, DescriptionItem, DescriptionList, type LinkComponent } from 'ferry-ui'
import { Globe, KeyRound, Tag, Users } from 'lucide-react'

// In an app, the link component of your router opens the page. This one stays on the page.
const DemoLink: LinkComponent = ({ href, onClick, ...props }) => (
  <a
    href={href}
    {...props}
    onClick={(event) => {
      onClick?.(event)
      event.preventDefault()
    }}
  />
)

export default function DescriptionListRows() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Acme workspace</CardTitle>
      </CardHeader>
      <DescriptionList variant="rows" divided={false} aria-label="Workspace summary">
        <DescriptionItem icon={<Users />} label="Members" hint="2 pending" href="#members" linkComponent={DemoLink}>
          18
        </DescriptionItem>
        <DescriptionItem icon={<KeyRound />} label="API keys" href="#api-keys" linkComponent={DemoLink}>
          4
        </DescriptionItem>
        <DescriptionItem icon={<Tag />} label="API version" mono>
          2026-03-01
        </DescriptionItem>
        <DescriptionItem icon={<Globe />} label="Region" mono>
          eu-west
        </DescriptionItem>
      </DescriptionList>
    </Card>
  )
}
