import type { ArgTypes, Meta, StoryObj } from '@storybook/react-vite'
import { Download, ExternalLink, MoreHorizontal, Plus, RefreshCw } from 'lucide-react'
import { expect, fn, userEvent, within } from 'storybook/test'

import { LinkProvider, type LinkComponent } from '../../lib/link'
import { Avatar, AvatarFallback } from '../primitives/avatar'
import { Badge } from '../primitives/badge'
import { Button } from '../primitives/button'
import { Card, CardContent } from '../primitives/card'
import { Input } from '../primitives/input'
import { Switch } from '../primitives/switch'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../primitives/table'
import { Tabs, TabsList, TabsTrigger } from '../primitives/tabs'

import { CopyField } from './copy'
import { FormActions, FormCard, FormRow } from './form-card'
import { FilterMenu, ListToolbar, SearchInput } from './list-toolbar'
import { PageBackLink, PageContainer, PageHeader, PageSection } from './page'

const navigate = fn().mockName('navigate')

/** A fake router adapter: logs the destination in the Actions panel instead of leaving the page. */
const RouterLink: LinkComponent = ({ href, onClick, ...props }) => (
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

const meta = {
  title: 'Patterns/Page',
  component: PageHeader,
  subcomponents: { PageContainer, PageSection, PageBackLink },
  // Every libui link on these pages goes through a fake router, so clicks stay in the story.
  decorators: [
    (Story) => (
      <LinkProvider component={RouterLink}>
        <Story />
      </LinkProvider>
    ),
  ],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Page building blocks. `PageContainer` is the centered column with the standard side padding (`narrow` for settings and forms, `default` for lists and overviews, `full` for wide tools); `PageHeader` is the single `<h1>` block with description, badges, eyebrow and actions; `PageBackLink` is the "← Parent" link that goes in the eyebrow of detail and create pages (rendered through your `LinkProvider` router adapter); `PageSection` splits the page into titled `<h2>` topics spaced 40px apart. Put them inside your app shell\'s scrollable main area.',
      },
    },
  },
  args: {
    title: 'Invoices',
    description: 'Every invoice issued to your customers, newest first.',
    size: 'md',
  },
  argTypes: {
    title: { control: 'text' },
    description: { control: 'text' },
    size: { control: 'inline-radio', options: ['md', 'lg'] },
    badges: { control: false },
    actions: { control: false },
    eyebrow: { control: false },
    children: { control: false },
  },
  render: (args) => (
    <PageContainer>
      <PageHeader {...args} />
    </PageContainer>
  ),
} satisfies Meta<typeof PageHeader>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

/** Actions on the right: secondary buttons first, the page's single primary action last. */
export const WithActions: Story = {
  args: {
    actions: (
      <>
        <Button icon={<Download />}>Export</Button>
        <Button variant="primary" icon={<Plus />}>
          New invoice
        </Button>
      </>
    ),
  },
}

/** Badges sit next to the title: a `Beta` tag or the record's status. */
export const WithBadges: Story = {
  args: {
    title: 'Usage reports',
    description: 'Daily breakdown of API calls per project.',
    badges: <Badge variant="info">Beta</Badge>,
  },
}

/** `size="lg"` for the home page of a single record, with a {@link PageBackLink} in `eyebrow`. */
export const RecordHome: Story = {
  args: {
    size: 'lg',
    title: 'Northwind Traders',
    description: 'Enterprise customer since March 2024 · 42 seats',
    badges: <Badge variant="success">Active</Badge>,
    eyebrow: <PageBackLink href="/customers">Customers</PageBackLink>,
    actions: (
      <>
        <Button icon={<ExternalLink />}>Open portal</Button>
        <Button size="icon" aria-label="More actions" icon={<MoreHorizontal />} />
      </>
    ),
  },
}

/** Long titles truncate on one line instead of pushing the actions away. */
export const LongTitle: Story = {
  args: {
    title: 'Quarterly revenue reconciliation for the European subsidiaries and partner resellers',
    actions: <Button icon={<RefreshCw />}>Refresh</Button>,
  },
}

/** `children` render under the title row: tabs, a summary strip, a callout. */
export const WithTabs: Story = {
  args: {
    title: 'Team',
    description: 'Manage who can access this workspace.',
    actions: (
      <Button variant="primary" icon={<Plus />}>
        Invite member
      </Button>
    ),
    children: (
      <Tabs defaultValue="members">
        <TabsList>
          <TabsTrigger value="members">Members</TabsTrigger>
          <TabsTrigger value="invitations">Invitations</TabsTrigger>
          <TabsTrigger value="roles">Roles</TabsTrigger>
        </TabsList>
      </Tabs>
    ),
  },
}

/** Hides controls that the meta declares but a subcomponent story does not use. */
const hideControls = (...names: string[]): ArgTypes =>
  Object.fromEntries(names.map((name) => [name, { table: { disable: true } }]))

/** `PageContainer` driven by the controls (the column is outlined for the demo). */
export const Container: StoryObj<typeof PageContainer> = {
  args: { size: 'narrow' },
  argTypes: {
    ...hideControls('title', 'description', 'badges', 'eyebrow', 'actions'),
    size: { control: 'inline-radio', options: ['narrow', 'default', 'full'] },
    children: { control: false },
  },
  render: ({ size, className }) => (
    <PageContainer size={size} className={className}>
      <div className="rounded-md border border-dashed border-border-stronger px-4 py-10 text-center text-sm text-foreground-light">
        Page content
      </div>
    </PageContainer>
  ),
  play: async ({ canvasElement }) => {
    const container = canvasElement.querySelector('[data-slot="page-container"]')
    await expect(container).toHaveAttribute('data-size', 'narrow')
  },
}

/**
 * `PageBackLink` driven by the controls, in its usual place: the `eyebrow` of a `PageHeader`.
 * Pass only the parent page's name; the arrow is part of the component.
 */
export const BackLink: StoryObj<typeof PageBackLink> = {
  args: { href: '/customers', children: 'Customers' },
  argTypes: {
    ...hideControls('title', 'description', 'size', 'badges', 'eyebrow', 'actions'),
    href: { control: 'text' },
    children: { control: 'text' },
    linkComponent: { control: false },
  },
  render: ({ href, children, linkComponent, className }) => (
    <PageContainer size="narrow">
      <PageHeader
        eyebrow={
          <PageBackLink href={href} linkComponent={linkComponent} className={className}>
            {children}
          </PageBackLink>
        }
        title="Northwind Traders"
        description="Enterprise customer since March 2024 · 42 seats"
      />
    </PageContainer>
  ),
  play: async ({ canvasElement }) => {
    navigate.mockClear()
    const canvas = within(canvasElement)
    const link = canvas.getByRole('link', { name: 'Customers' })
    await expect(link).toHaveAttribute('href', '/customers')
    await expect(link).toHaveAttribute('data-slot', 'page-back-link')
    // Rendered through the LinkProvider's adapter, above the title.
    await expect(link).toHaveAttribute('data-router-link')
    const heading = canvas.getByRole('heading', { level: 1, name: 'Northwind Traders' })
    await expect(link.compareDocumentPosition(heading) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    await userEvent.click(link)
    await expect(navigate).toHaveBeenCalledWith('/customers')
  },
}

/** `PageSection` driven by the controls: `<h2>` heading, description, actions, then its content. */
export const Section: StoryObj<typeof PageSection> = {
  args: {
    title: 'Payment methods',
    description: 'The default card is charged on the 1st of every month.',
    id: 'payment-methods',
  },
  argTypes: {
    ...hideControls('size', 'badges', 'eyebrow'),
    title: { control: 'text' },
    description: { control: 'text' },
    id: { control: 'text' },
    actions: { control: false },
    children: { control: false },
  },
  render: ({ title, description, id, className }) => (
    <PageContainer size="narrow">
      <PageSection
        title={title}
        description={description}
        id={id}
        className={className}
        actions={
          <Button size="tiny" icon={<Plus />}>
            Add card
          </Button>
        }
      >
        <Card>
          <CardContent className="flex items-center justify-between gap-4 text-sm">
            <span className="text-foreground">Visa ending in 4242</span>
            <Badge variant="default">Default</Badge>
          </CardContent>
        </Card>
      </PageSection>
    </PageContainer>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const section = canvas.getByRole('region', { name: 'Payment methods' })
    await expect(section).toHaveAttribute('id', 'payment-methods')
    await expect(within(section).getByRole('button', { name: 'Add card' })).toBeInTheDocument()
  },
}

/** The three `PageContainer` widths (outlined for the demo). */
export const ContainerSizes: Story = {
  render: () => (
    <div className="flex flex-col gap-2 py-4">
      {(['narrow', 'default', 'full'] as const).map((size) => (
        <PageContainer key={size} size={size} className="pb-6">
          <div className="rounded-md border border-dashed border-border-stronger px-4 py-3 font-mono text-[13px] text-foreground-light">
            size=&quot;{size}&quot;
          </div>
        </PageContainer>
      ))}
    </div>
  ),
}

/** `PageSection`: an `<h2>` heading (labels the section landmark), description, actions, content. */
export const Sections: Story = {
  render: () => (
    <PageContainer size="narrow">
      <PageSection
        id="usage"
        title="Usage"
        description="Resets on the 1st of every month."
        actions={
          <Button size="tiny" asChild>
            <a href="#usage">View details</a>
          </Button>
        }
      >
        <Card>
          <CardContent className="grid grid-cols-3 gap-4">
            {[
              ['API calls', '1.28M'],
              ['Storage', '48.2 GB'],
              ['Seats', '8 / 10'],
            ].map(([label, value]) => (
              <div key={label} className="flex flex-col gap-1">
                <span className="mono-label">{label}</span>
                <span className="text-xl text-foreground tabular">{value}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </PageSection>
      <PageSection title="Notes">
        <p className="text-sm text-foreground-light">A section can hold any content, not only cards.</p>
      </PageSection>
    </PageContainer>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const usage = canvas.getByRole('region', { name: 'Usage' })
    await expect(within(usage).getByRole('heading', { level: 2, name: 'Usage' })).toBeInTheDocument()
    await expect(usage).toHaveAttribute('id', 'usage')
  },
}

const INVOICES = [
  { id: 'INV-2026-0142', customer: 'Northwind Traders', status: 'paid', amount: '$4,280.00', due: 'Oct 14, 2026' },
  { id: 'INV-2026-0141', customer: 'Globex Corporation', status: 'open', amount: '$1,150.00', due: 'Oct 12, 2026' },
  { id: 'INV-2026-0140', customer: 'Initech', status: 'overdue', amount: '$640.00', due: 'Sep 28, 2026' },
  { id: 'INV-2026-0139', customer: 'Umbrella Health', status: 'paid', amount: '$12,900.00', due: 'Sep 21, 2026' },
  { id: 'INV-2026-0138', customer: 'Stark Logistics', status: 'draft', amount: '$385.50', due: '—' },
] as const

const STATUS_BADGE = {
  paid: { label: 'Paid', variant: 'success' },
  open: { label: 'Open', variant: 'info' },
  overdue: { label: 'Overdue', variant: 'destructive' },
  draft: { label: 'Draft', variant: 'default' },
} as const

/** Composition: a list page — header, toolbar (search, filter, primary action) and a table. */
export const ListPage: Story = {
  render: () => (
    <PageContainer>
      <PageHeader
        title="Invoices"
        description="Every invoice issued to your customers, newest first."
        actions={<Button icon={<Download />}>Export CSV</Button>}
      />
      <ListToolbar
        className="mb-4"
        actions={
          <Button variant="primary" icon={<Plus />}>
            New invoice
          </Button>
        }
      >
        <SearchInput placeholder="Search invoices" />
        <FilterMenu
          label="Status"
          options={Object.entries(STATUS_BADGE).map(([value, s]) => ({
            value,
            label: s.label,
            count: INVOICES.filter((i) => i.status === value).length,
          }))}
        />
      </ListToolbar>
      {/* `Table` brings its own bordered container: do not wrap it in a Card. */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Invoice</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Due</TableHead>
            <TableHead className="text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {INVOICES.map((inv) => (
            <TableRow key={inv.id}>
              <TableCell className="font-mono text-[13px]">{inv.id}</TableCell>
              <TableCell>{inv.customer}</TableCell>
              <TableCell>
                <Badge variant={STATUS_BADGE[inv.status].variant}>{STATUS_BADGE[inv.status].label}</Badge>
              </TableCell>
              <TableCell className="text-foreground-light">{inv.due}</TableCell>
              <TableCell className="text-right tabular">{inv.amount}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </PageContainer>
  ),
}

/** Composition: a narrow settings page — header, then one section per topic with a FormCard each. */
export const SettingsPage: Story = {
  render: () => (
    <PageContainer size="narrow">
      <PageHeader title="Workspace settings" description="Manage your workspace name, members and security." />
      <PageSection title="General">
        <FormCard aria-label="General settings" footer={<FormActions dirty={false} onReset={() => {}} />}>
          <FormRow label="Workspace name" htmlFor="ws-name" description="Shown in the sidebar and in emails.">
            <Input id="ws-name" defaultValue="Acme Inc." />
          </FormRow>
          <FormRow label="Workspace ID" htmlFor="ws-id" description="Used when contacting support.">
            <CopyField id="ws-id" value="ws_3Rk8pQ2mZt" what="workspace ID" />
          </FormRow>
        </FormCard>
      </PageSection>
      <PageSection title="Security" description="Applies to every member at their next sign-in.">
        <FormCard asDiv>
          <FormRow label="Require two-factor authentication" htmlFor="ws-2fa">
            <Switch id="ws-2fa" defaultChecked />
          </FormRow>
          <FormRow label="Owners" description="Owners can delete the workspace and manage billing.">
            <div className="flex items-center gap-2">
              {['JD', 'MK', 'AR'].map((initials) => (
                <Avatar key={initials} className="size-7">
                  <AvatarFallback className="text-[11px]">{initials}</AvatarFallback>
                </Avatar>
              ))}
            </div>
          </FormRow>
        </FormCard>
      </PageSection>
      <PageSection title="Danger zone">
        <FormCard asDiv className="border-destructive-border">
          <FormRow label="Delete workspace" description="Permanently removes every project, member and invoice.">
            <div>
              <Button variant="destructive">Delete workspace</Button>
            </div>
          </FormRow>
        </FormCard>
      </PageSection>
    </PageContainer>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('heading', { level: 1, name: 'Workspace settings' })).toBeInTheDocument()
    await expect(canvas.getAllByRole('heading', { level: 2 }).map((h) => h.textContent)).toEqual([
      'General',
      'Security',
      'Danger zone',
    ])
    const toggle = canvas.getByRole('switch', { name: 'Require two-factor authentication' })
    await userEvent.click(toggle)
    await expect(toggle).toHaveAttribute('aria-checked', 'false')
  },
}

/** Composition: a narrow create page — back link to the list, header, then the form in sections. */
export const CreatePage: Story = {
  render: () => (
    <PageContainer size="narrow">
      <PageHeader
        eyebrow={<PageBackLink href="/projects">Projects</PageBackLink>}
        title="Create a new project"
        description="Name your project and invite your team. You can change both later in its settings."
      />
      <form aria-label="New project" onSubmit={(event) => event.preventDefault()}>
        <PageSection title="General">
          <FormCard asDiv>
            <FormRow label="Project name" htmlFor="project-name" description="Shown in the sidebar and in URLs.">
              <Input id="project-name" placeholder="acme-web" />
            </FormRow>
            <FormRow label="Invite members" htmlFor="project-invites" description="Comma-separated email addresses.">
              <Input id="project-invites" placeholder="jane@acme.com, mark@acme.com" />
            </FormRow>
          </FormCard>
        </PageSection>
        <div className="flex justify-end gap-2">
          <Button type="button">Cancel</Button>
          <Button type="submit" variant="primary" icon={<Plus />}>
            Create project
          </Button>
        </div>
      </form>
    </PageContainer>
  ),
  play: async ({ canvasElement }) => {
    navigate.mockClear()
    const canvas = within(canvasElement)
    const back = canvas.getByRole('link', { name: 'Projects' })
    await userEvent.click(back)
    await expect(navigate).toHaveBeenCalledWith('/projects')
  },
}
