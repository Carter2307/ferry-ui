import * as React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Download, Home, Slash } from 'lucide-react'
import { expect, userEvent, waitFor, within } from 'storybook/test'

import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from './breadcrumb'
import { Badge } from './badge'
import { Button } from './button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './dropdown-menu'
import { LinkProvider, type LinkComponent } from '../../lib/link'

const meta = {
  title: 'Primitives/Breadcrumb',
  component: Breadcrumb,
  subcomponents: {
    BreadcrumbList,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbPage,
    BreadcrumbSeparator,
    BreadcrumbEllipsis,
  },
  parameters: {
    docs: {
      description: {
        component:
          'Shows where the current page sits in a hierarchy and links back to its ancestors. End with exactly one `BreadcrumbPage`; collapse deep middle levels into a `BreadcrumbEllipsis` menu. `BreadcrumbLink` renders through the ferry-ui link contract: wrap the app in `LinkProvider` (or pass `linkComponent`) to use your router, or use `asChild` to style an element you render yourself.',
      },
    },
  },
  argTypes: {
    children: { control: false },
  },
  render: (args) => (
    <Breadcrumb {...args}>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="#">Acme Inc.</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="#">Projects</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Website redesign</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  ),
} satisfies Meta<typeof Breadcrumb>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('navigation', { name: 'breadcrumb' })).toBeInTheDocument()
    await expect(canvas.getByRole('link', { name: 'Projects' })).toHaveAttribute('href', '#')
    await expect(canvas.getByText('Website redesign')).toHaveAttribute('aria-current', 'page')
  },
}

/** Keyboard users tab through the ancestor links; each one shows the standard focus ring. */
export const KeyboardFocus: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const workspace = canvas.getByRole('link', { name: 'Acme Inc.' })
    await userEvent.tab()
    await expect(workspace).toHaveFocus()
    await expect(workspace).toHaveClass('focus-visible:ring-2', 'focus-visible:ring-ring')
    await userEvent.tab()
    await expect(canvas.getByRole('link', { name: 'Projects' })).toHaveFocus()
  },
}

/** Pass children to `BreadcrumbSeparator` to replace the default chevron. */
export const CustomSeparator: Story = {
  render: (args) => (
    <Breadcrumb {...args}>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="#">Acme Inc.</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator>
          <Slash className="-rotate-12" />
        </BreadcrumbSeparator>
        <BreadcrumbItem>
          <BreadcrumbLink href="#">Settings</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator>
          <Slash className="-rotate-12" />
        </BreadcrumbSeparator>
        <BreadcrumbItem>
          <BreadcrumbPage>Billing</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  ),
}

/** An icon-only root crumb keeps an accessible name through `sr-only` text. */
export const WithIcon: Story = {
  render: (args) => (
    <Breadcrumb {...args}>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="#" className="flex items-center">
            <Home className="size-3.5" />
            <span className="sr-only">Home</span>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="#">Team</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Maya Chen</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  ),
}

/** Deep hierarchies collapse their middle levels into an ellipsis that opens a menu. */
export const Collapsed: Story = {
  render: (args) => (
    <Breadcrumb {...args}>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="#">Acme Inc.</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <DropdownMenu>
            <DropdownMenuTrigger
              aria-label="Show hidden levels"
              className="flex cursor-pointer items-center rounded-sm outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
            >
              <BreadcrumbEllipsis className="size-5" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem>Documents</DropdownMenuItem>
              <DropdownMenuItem>Finance</DropdownMenuItem>
              <DropdownMenuItem>2025</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="#">Invoices</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>INV-2041</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const trigger = canvas.getByRole('button', { name: 'Show hidden levels' })
    trigger.focus()
    await userEvent.keyboard('{Enter}')
    const body = within(canvasElement.ownerDocument.body)
    await waitFor(() => expect(body.getByRole('menuitem', { name: 'Finance' })).toBeInTheDocument())
    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(body.queryByRole('menu')).not.toBeInTheDocument())
  },
}

/**
 * Router integration: `BreadcrumbLink` renders the link component from the nearest `LinkProvider`
 * (or its own `linkComponent` prop). Here a fake client-side router intercepts the clicks.
 */
export const WithRouterLink: Story = {
  render: (args) => <RouterLinkExample {...args} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const projects = canvas.getByRole('link', { name: 'Projects' })
    await expect(projects).toHaveAttribute('data-router-link')
    await expect(projects).toHaveAttribute('data-slot', 'breadcrumb-link')

    await userEvent.click(projects)
    await expect(canvas.getByRole('status')).toHaveTextContent('/projects')
  },
}

// A minimal client-side router for the demo: links read `navigate` from context.
const NavigateContext = React.createContext<(href: string) => void>(() => undefined)

/** A router adapter: forwards every prop to the anchor and navigates client-side on click. */
const RouterLink: LinkComponent = ({ href, onClick, ...props }) => {
  const navigate = React.useContext(NavigateContext)
  return (
    <a
      {...props}
      href={href}
      data-router-link=""
      onClick={(event) => {
        onClick?.(event)
        if (event.defaultPrevented) return
        event.preventDefault()
        navigate(href)
      }}
    />
  )
}

function RouterLinkExample(props: React.ComponentProps<typeof Breadcrumb>) {
  const [location, setLocation] = React.useState('/projects/website-redesign')
  return (
    <NavigateContext.Provider value={setLocation}>
      <LinkProvider component={RouterLink}>
        <div className="flex flex-col gap-3">
          <Breadcrumb {...props}>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Acme Inc.</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/projects">Projects</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Website redesign</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <div role="status" className="font-mono text-xs text-foreground-lighter">
            location: {location}
          </div>
        </div>
      </LinkProvider>
    </NavigateContext.Provider>
  )
}

/** A link component with its own props (here a typed `to` object) that does not fit the `href` contract. */
function TypedLink({ to, ...props }: Omit<React.ComponentProps<'a'>, 'href'> & { to: { path: string } }) {
  return <a href={`#${to.path}`} {...props} />
}

/** `asChild` merges the crumb styles onto a link element you render yourself, e.g. a router link with its own props. */
export const AsChild: Story = {
  render: (args) => (
    <Breadcrumb {...args}>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <TypedLink to={{ path: '/customers' }}>Customers</TypedLink>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Northwind Traders</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  ),
  play: async ({ canvasElement }) => {
    const link = within(canvasElement).getByRole('link', { name: 'Customers' })
    await expect(link).toHaveAttribute('data-slot', 'breadcrumb-link')
    await expect(link).toHaveAttribute('href', '#/customers')
  },
}

/**
 * Long names: the list wraps on narrow widths; cap individual crumbs with `max-w-* truncate`
 * (and keep the full name in `title`).
 */
export const LongPath: Story = {
  render: (args) => (
    <div className="w-72 rounded-lg border p-3">
      <Breadcrumb {...args}>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="#">Acme Inc.</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="#">Customer onboarding</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="#" className="max-w-32 truncate" title="Quarterly business reviews">
              Quarterly business reviews
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="max-w-40 truncate" title="Q3 2025 review with Northwind Traders">
              Q3 2025 review with Northwind Traders
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  ),
}

/** A page header: breadcrumb above the title, with the page actions on the right. */
export const PageHeader: Story = {
  parameters: { layout: 'padded' },
  render: (args) => (
    <div className="flex max-w-3xl flex-col gap-2 border-b pb-4">
      <Breadcrumb {...args}>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="#">Billing</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="#">Invoices</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>INV-2041</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="flex items-center gap-3">
        <h1 className="text-xl font-medium text-foreground">Invoice INV-2041</h1>
        <Badge variant="success">Paid</Badge>
        <div className="ml-auto flex items-center gap-2">
          <Button icon={<Download />}>Download PDF</Button>
          <Button variant="primary">Send receipt</Button>
        </div>
      </div>
    </div>
  ),
}
