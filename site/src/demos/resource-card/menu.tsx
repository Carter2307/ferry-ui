import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  ResourceCard,
  ResourceGrid,
  toast,
  type LinkComponent,
} from '@roger.b/libui'
import { LayoutDashboard, MoreVertical, Smartphone } from 'lucide-react'

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
  { id: 'web-app', name: 'Web app', icon: <LayoutDashboard />, owner: 'Maya Chen' },
  { id: 'mobile-app', name: 'Mobile app', icon: <Smartphone />, owner: 'Jonas Weber' },
]

export default function ResourceCardMenu() {
  return (
    <ResourceGrid aria-label="Projects">
      {PROJECTS.map(({ id, name, icon, owner }) => (
        <ResourceCard
          key={id}
          name={name}
          href={`#${id}`}
          linkComponent={DemoLink}
          icon={icon}
          subtitle={`Owner: ${owner}`}
          menu={
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon-tiny" icon={<MoreVertical />} aria-label={`Actions for ${name}`} />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44">
                <DropdownMenuItem onSelect={() => toast(`Renamed: ${name}`)}>Rename</DropdownMenuItem>
                <DropdownMenuItem onSelect={() => toast(`Archived: ${name}`)}>Archive</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          }
        />
      ))}
    </ResourceGrid>
  )
}
