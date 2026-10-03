import { Badge, ResourceCard, StatusLine, type LinkComponent } from '@roger.b/libui'
import { LayoutDashboard } from 'lucide-react'

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

export default function ResourceCardStandalone() {
  return (
    <ResourceCard
      as="div"
      className="w-full max-w-xs"
      name="Web app"
      href="#web-app"
      linkComponent={DemoLink}
      icon={<LayoutDashboard />}
      subtitle="Owner: Maya Chen"
      badges={
        <Badge font="mono" shape="square">
          pro
        </Badge>
      }
      footer={<StatusLine tone="success">Project is active</StatusLine>}
    />
  )
}
