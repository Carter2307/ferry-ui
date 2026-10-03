import { Button, ResourceCard, ResourceGrid, StatusLine, toast, type LinkComponent } from 'libui'
import { LayoutDashboard, Smartphone, Users } from 'lucide-react'

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

export default function ResourceCardFooter() {
  return (
    <ResourceGrid aria-label="Projects">
      <ResourceCard
        name="Web app"
        href="#web-app"
        linkComponent={DemoLink}
        icon={<LayoutDashboard />}
        footer={
          <>
            <span className="inline-flex items-center gap-1.5 text-[13px] text-foreground-lighter">
              <Users className="size-3.5" aria-hidden="true" />
              12 members
            </span>
            <StatusLine tone="success">Project is active</StatusLine>
          </>
        }
      />
      <ResourceCard
        name="Mobile app"
        href="#mobile-app"
        linkComponent={DemoLink}
        icon={<Smartphone />}
        footer={
          <div className="flex items-center justify-between gap-3">
            <StatusLine tone="destructive">Import failed</StatusLine>
            {/* `relative z-10` puts the button above the link of the card. */}
            <Button size="tiny" className="relative z-10" onClick={() => toast('The import starts again')}>
              Retry
            </Button>
          </div>
        }
      />
    </ResourceGrid>
  )
}
