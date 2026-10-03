import * as React from 'react'
import { InnerMenu, LinkProvider, type LinkComponent, type NavGroup } from 'libui-kit'

// This context does the work of a router in the demo: a click changes the location.
const NavigateContext = React.createContext<(href: string) => void>(() => {})

// The adapter. In an app, it renders the link of the router: <Link to={href} {...props} />.
const DemoLink: LinkComponent = ({ href, onClick, ...props }) => {
  const navigate = React.useContext(NavigateContext)
  return (
    <a
      href={href}
      {...props}
      onClick={(event) => {
        onClick?.(event)
        event.preventDefault()
        navigate(href)
      }}
    />
  )
}

const PAGES = [
  { id: 'profile', label: 'Profile', href: '#profile' },
  { id: 'members', label: 'Members', href: '#members' },
  { id: 'billing', label: 'Billing', href: '#billing' },
]

export default function ActiveFromRouter() {
  const [location, setLocation] = React.useState('#members')
  // The location of the router gives the active item.
  const groups: NavGroup[] = [
    { id: 'settings', items: PAGES.map((page) => ({ ...page, active: page.href === location })) },
  ]

  return (
    <NavigateContext.Provider value={setLocation}>
      <LinkProvider component={DemoLink}>
        <div className="flex w-full max-w-md overflow-hidden rounded-lg border">
          <InnerMenu groups={groups} label="Settings" mobileTabs={false} className="w-44 xl:w-44" />
          <p className="p-5 text-[13px] text-foreground-light">
            Location of the router: <code className="text-foreground">{location}</code>
          </p>
        </div>
      </LinkProvider>
    </NavigateContext.Provider>
  )
}
