import { Badge, ResourceCard, ResourceGrid, StatusLine, type LinkComponent } from 'libui-kit'
import { BookOpen, Globe, LayoutDashboard, Smartphone } from 'lucide-react'

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

const PROJECTS = [
  { id: 'web-app', name: 'Web app', icon: <LayoutDashboard />, owner: 'Maya Chen', plan: 'pro' },
  { id: 'mobile-app', name: 'Mobile app', icon: <Smartphone />, owner: 'Jonas Weber', plan: 'pro' },
  { id: 'website', name: 'Website', icon: <Globe />, owner: 'Priya Patel', plan: 'free' },
  { id: 'docs-portal', name: 'Docs portal', icon: <BookOpen />, owner: 'Maya Chen', plan: 'free' },
]

export default function ResourceCardHero() {
  return (
    <ResourceGrid aria-label="Projects">
      {PROJECTS.map((project) => (
        <ResourceCard
          key={project.id}
          name={project.name}
          href={`#${project.id}`}
          linkComponent={DemoLink}
          icon={project.icon}
          subtitle={`Owner: ${project.owner}`}
          badges={
            <Badge font="mono" shape="square">
              {project.plan}
            </Badge>
          }
          footer={<StatusLine tone="success">Project is active</StatusLine>}
        />
      ))}
    </ResourceGrid>
  )
}
