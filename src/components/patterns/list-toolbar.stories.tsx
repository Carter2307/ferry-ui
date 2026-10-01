import * as React from 'react'
import type { ArgTypes, Meta, StoryObj } from '@storybook/react-vite'
import { ArrowUpDown, Download, LayoutGrid, List, Plus } from 'lucide-react'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'

import { Button } from '../primitives/button'
import { Checkbox } from '../primitives/checkbox'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '../primitives/dropdown-menu'
import { Popover, PopoverContent, PopoverTrigger } from '../primitives/popover'
import { ToggleGroup, ToggleGroupItem } from '../primitives/toggle-group'
import { Hint } from '../primitives/tooltip'

import { FilterButton, FilterMenu, type FilterOption, ListToolbar, SearchInput } from './list-toolbar'

/** Hides controls that the meta declares but a subcomponent story does not use. */
const hideControls = (...names: string[]): ArgTypes =>
  Object.fromEntries(names.map((name) => [name, { table: { disable: true } }]))

/** Stories that render a menu open get their own iframe on the docs page (an open menu locks the page). */
const openInIframe = { docs: { story: { inline: false, iframeHeight: 300 } } }

type ProjectStatus = 'active' | 'paused' | 'archived'

const PROJECTS: { name: string; owner: string; status: ProjectStatus; plan: string; updated: number }[] = [
  { name: 'Customer portal', owner: 'Jane Doe', status: 'active', plan: 'pro', updated: 2 },
  { name: 'Marketing site', owner: 'Marc Keller', status: 'active', plan: 'free', updated: 5 },
  { name: 'Billing dashboard', owner: 'Aisha Rahman', status: 'paused', plan: 'enterprise', updated: 9 },
  { name: 'Mobile app backend', owner: 'Jane Doe', status: 'active', plan: 'enterprise', updated: 1 },
  { name: 'Internal wiki', owner: 'Tom Nguyen', status: 'archived', plan: 'free', updated: 120 },
  { name: 'Analytics pipeline', owner: 'Aisha Rahman', status: 'paused', plan: 'pro', updated: 30 },
]

const STATUS_DOT: Record<ProjectStatus, string> = {
  active: 'bg-success',
  paused: 'bg-warning',
  archived: 'bg-foreground-muted',
}

const dot = (status: ProjectStatus) => (
  <span aria-hidden="true" className={`size-2 shrink-0 rounded-full ${STATUS_DOT[status]}`} />
)

const STATUS_OPTIONS: FilterOption[] = (['active', 'paused', 'archived'] as const).map((status) => ({
  value: status,
  label: status.charAt(0).toUpperCase() + status.slice(1),
  icon: dot(status),
  count: PROJECTS.filter((p) => p.status === status).length,
}))

const PLAN_OPTIONS: FilterOption[] = [
  { value: 'free', label: 'Free', count: PROJECTS.filter((p) => p.plan === 'free').length },
  { value: 'pro', label: 'Pro', count: PROJECTS.filter((p) => p.plan === 'pro').length },
  { value: 'enterprise', label: 'Enterprise', count: PROJECTS.filter((p) => p.plan === 'enterprise').length },
  { value: 'legacy', label: 'Legacy', count: 0, disabled: true },
]

const meta = {
  title: 'Patterns/List Toolbar',
  component: ListToolbar,
  subcomponents: { SearchInput, FilterButton, FilterMenu },
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'The row above a list or table: `SearchInput` first (icon, clear button, Escape clears), then one dashed `FilterButton` per filter dimension — `FilterMenu` wires it to a checkbox menu with counts — and a sort menu; `actions` pushes view toggles and the primary "New …" button to the right. Everything wraps on narrow screens. Filters are controlled (`value` + `onValueChange`) or uncontrolled. Every built-in text is a prop with an English default, for translation: `SearchInput` `clearLabel`, `FilterMenu` `heading` / `clearLabel` / `triggerLabel`.',
      },
    },
  },
  argTypes: {
    actions: { control: false },
    children: { control: false },
    className: { control: 'text' },
  },
  render: (args) => <ProjectsDemo {...args} />,
} satisfies Meta<typeof ListToolbar>

export default meta
type Story = StoryObj<typeof meta>

/**
 * Full toolbar driving a live list: search, two filters, sort, view toggle and the primary action.
 * `className` is the live control (try `justify-end` or `gap-4`).
 */
export const Default: Story = {}

/** Typing filters the list; Escape and the × button clear the query. */
export const SearchInteraction: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const search = canvas.getByRole('searchbox', { name: 'Search projects' })
    await userEvent.type(search, 'billing')
    await expect(canvas.getByText('Billing dashboard')).toBeInTheDocument()
    await expect(canvas.queryByText('Marketing site')).not.toBeInTheDocument()

    await userEvent.keyboard('{Escape}')
    await expect(search).toHaveValue('')
    await expect(canvas.getByText('Marketing site')).toBeInTheDocument()

    await userEvent.type(search, 'zzz')
    await expect(canvas.getByText('No projects match your filters.')).toBeInTheDocument()
    await userEvent.click(canvas.getByRole('button', { name: 'Clear search' }))
    await expect(search).toHaveValue('')
    await expect(search).toHaveFocus()
  },
}

/** Toggling a FilterMenu option (keyboard) filters the list and updates the trigger's badge and name. */
export const FilterInteraction: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const body = within(canvasElement.ownerDocument.body)
    const trigger = canvas.getByRole('button', { name: 'Filter by status' })
    trigger.focus()
    await userEvent.keyboard('{Enter}')
    const menu = await body.findByRole('menu')
    const paused = within(menu).getByRole('menuitemcheckbox', { name: /Paused/ })
    await waitFor(() => expect(within(menu).getByRole('menuitemcheckbox', { name: /Active/ })).toHaveFocus())
    await userEvent.keyboard('{ArrowDown}')
    await waitFor(() => expect(paused).toHaveFocus())
    await userEvent.keyboard('{Enter}')
    await expect(paused).toHaveAttribute('aria-checked', 'true')
    await userEvent.keyboard('{Escape}')
    // Checked through attributes: the page stays aria-hidden until the menu's exit animation ends.
    await waitFor(() => expect(trigger).toHaveAttribute('aria-expanded', 'false'))
    await expect(trigger).toHaveAttribute('aria-label', 'Status filter: Paused')
    await expect(canvas.getByText('Billing dashboard')).toBeInTheDocument()
    await expect(canvas.queryByText('Customer portal')).not.toBeInTheDocument()
  },
}

/** Narrow container: the search goes full width and the controls wrap onto new lines. */
export const Wrapping: Story = {
  render: (args) => (
    <div className="max-w-[380px] rounded-md border border-dashed border-border-stronger p-3">
      <ProjectsDemo {...args} />
    </div>
  ),
}

/** `SearchInput` on its own, uncontrolled, with `onValueChange` logged. `clearLabel` names the × button. */
export const Search: StoryObj<typeof SearchInput> = {
  args: { placeholder: 'Search invoices', clearLabel: 'Clear search', onValueChange: fn(), defaultValue: '' },
  argTypes: {
    size: { control: 'inline-radio', options: ['tiny', 'sm', 'md'] },
    placeholder: { control: 'text' },
    label: { control: 'text' },
    clearLabel: { control: 'text' },
    inputClassName: { control: 'text' },
    disabled: { control: 'boolean' },
    ...hideControls('actions'),
  },
  render: (args) => <SearchInput {...args} />,
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByRole('searchbox', { name: 'Search invoices' })
    await userEvent.type(input, 'INV')
    await expect(args.onValueChange).toHaveBeenLastCalledWith('INV')
    await userEvent.keyboard('{Escape}')
    await expect(args.onValueChange).toHaveBeenLastCalledWith('')
    await expect(input).toHaveValue('')
  },
}

/**
 * Sizes and states. The last two fields show `label` (an accessible name longer than the placeholder)
 * with a translated `clearLabel`, and `inputClassName` (here a mono face for identifiers).
 */
export const SearchStates: StoryObj<typeof SearchInput> = {
  render: () => (
    <div className="flex w-[320px] flex-col gap-3">
      <SearchInput size="tiny" placeholder="Tiny (26px)" />
      <SearchInput placeholder="Small (30px, default)" />
      <SearchInput size="md" placeholder="Medium (34px)" />
      <SearchInput placeholder="With a query" defaultValue="northwind" />
      <SearchInput placeholder="Disabled" disabled />
      <SearchInput label="Search by customer or number" placeholder="Search" defaultValue="acme" clearLabel="Effacer la recherche" />
      <SearchInput label="Search by invoice number" placeholder="INV-2041" inputClassName="font-mono" />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('searchbox', { name: 'Search by customer or number' })).toHaveValue('acme')
    await expect(canvas.getByRole('button', { name: 'Effacer la recherche' })).toBeInTheDocument()
    await expect(canvas.getByRole('searchbox', { name: 'Search by invoice number' })).toHaveClass('font-mono')
  },
}

/**
 * `FilterButton` driven by the controls: `selected` holds the labels of the selected values and
 * drives the count badge, the solid border, the tooltip and the accessible name.
 */
export const Filter: StoryObj<typeof FilterButton> = {
  args: { label: 'Status', selected: ['Paid', 'Overdue'], disabled: false, onClick: fn() },
  argTypes: {
    label: { control: 'text' },
    selected: { control: 'object' },
    size: { control: 'select', options: ['tiny', 'sm', 'md'] },
    icon: { control: false },
    iconRight: { control: false },
    asChild: { control: false },
    ...hideControls('actions'),
  },
  render: (args) => <FilterButton {...args} />,
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const button = canvas.getByRole('button', { name: 'Status filter: Paid, Overdue' })
    await expect(button).toHaveAttribute('data-active', 'true')
    await expect(button).toHaveTextContent('Status2')
    await userEvent.click(button)
    await expect(args.onClick).toHaveBeenCalledOnce()
  },
}

/** `FilterButton` states: inactive (dashed), active with a count badge (solid), disabled. */
export const FilterButtonStates: StoryObj<typeof FilterButton> = {
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <FilterButton label="Status" />
      <FilterButton label="Owner" selected={['Jane Doe', 'Aisha Rahman']} />
      <FilterButton label="Plan" selected={['Pro']} />
      <FilterButton label="Team" disabled />
    </div>
  ),
}

/** `FilterMenu` open, with icons, counts, a disabled option and the Clear item. */
export const FilterMenuOpen: StoryObj<typeof FilterMenu> = {
  parameters: openInIframe,
  args: {
    label: 'Status',
    options: STATUS_OPTIONS,
    defaultValue: ['active'],
    defaultOpen: true,
    onValueChange: fn(),
    onOpenChange: fn(),
  },
  argTypes: { options: { control: false } },
  render: (args) => (
    <div className="h-56">
      <FilterMenu {...args} />
    </div>
  ),
  play: async ({ args, canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body)
    const menu = await body.findByRole('menu')
    await expect(within(menu).getByRole('menuitemcheckbox', { name: /Active/ })).toHaveAttribute('aria-checked', 'true')
    await expect(within(menu).getByRole('menuitem', { name: /Clear filter/ })).toBeInTheDocument()
    await expect(args.onValueChange).not.toHaveBeenCalled()
  },
}

/**
 * `FilterMenu` with custom texts: `heading`, `clearLabel` and `triggerLabel` (the accessible name of the
 * trigger) are the three strings to translate; `align="end"` and `contentClassName` place and size the
 * panel. Activating the reset item calls `onValueChange([])` and closes the menu.
 */
export const FilterMenuCustomText: StoryObj<typeof FilterMenu> = {
  parameters: openInIframe,
  args: {
    label: 'Status',
    options: STATUS_OPTIONS,
    defaultValue: ['active'],
    defaultOpen: true,
    heading: 'Show projects that are',
    clearLabel: 'Reset',
    triggerLabel: (label, selected) =>
      selected.length > 0 ? `${label}: ${selected.join(', ')}. Change filter` : `Choose a ${label.toLowerCase()}`,
    align: 'end',
    contentClassName: 'w-56',
    onValueChange: fn(),
    onOpenChange: fn(),
  },
  argTypes: {
    options: { control: false },
    triggerLabel: { control: false },
    heading: { control: 'text' },
    clearLabel: { control: 'text' },
    align: { control: 'inline-radio', options: ['start', 'center', 'end'] },
    ...hideControls('actions', 'children'),
  },
  render: (args) => (
    <div className="flex h-56 justify-end">
      <FilterMenu {...args} />
    </div>
  ),
  play: async ({ args, canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body)
    const menu = await body.findByRole('menu')
    await expect(within(menu).getByText('Show projects that are')).toBeInTheDocument()
    await expect(menu).toHaveClass('w-56')
    // Read through the attribute: the page is aria-hidden while the (modal) menu is open.
    const trigger = canvasElement.querySelector('button[aria-haspopup="menu"]')
    await expect(trigger).toHaveAttribute('aria-label', 'Status: Active. Change filter')

    const reset = within(menu).getByRole('menuitem', { name: /Reset/ })
    reset.focus()
    await userEvent.keyboard('{Enter}')
    await expect(args.onValueChange).toHaveBeenLastCalledWith([])
    await waitFor(() => expect(args.onOpenChange).toHaveBeenLastCalledWith(false))
    await waitFor(() => expect(trigger).toHaveAttribute('aria-label', 'Choose a status'))
  },
}

/** `heading={null}` removes the mono heading: the options start at the top of the panel. */
export const FilterMenuWithoutHeading: StoryObj<typeof FilterMenu> = {
  parameters: openInIframe,
  args: { label: 'Status', options: STATUS_OPTIONS, defaultOpen: true, heading: null },
  argTypes: { options: { control: false }, ...hideControls('actions', 'children') },
  render: (args) => (
    <div className="h-56">
      <FilterMenu {...args} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body)
    const menu = await body.findByRole('menu')
    await expect(within(menu).getAllByRole('menuitemcheckbox')).toHaveLength(3)
    await expect(within(menu).queryByText(/filter by status/i)).not.toBeInTheDocument()
    // Nothing is selected: no reset item either.
    await expect(within(menu).queryByRole('menuitem')).not.toBeInTheDocument()
  },
}

/** `disabled` disables the trigger; the selection stays visible in its badge and accessible name. */
export const FilterMenuDisabled: StoryObj<typeof FilterMenu> = {
  args: { label: 'Status', options: STATUS_OPTIONS, defaultValue: ['active', 'paused'], disabled: true },
  argTypes: { options: { control: false }, disabled: { control: 'boolean' }, ...hideControls('actions', 'children') },
  render: (args) => <FilterMenu {...args} />,
  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByRole('button', { name: 'Status filter: Active, Paused' })
    await expect(trigger).toBeDisabled()
    await userEvent.click(trigger, { pointerEventsCheck: 0 })
    await expect(trigger).toHaveAttribute('aria-expanded', 'false')
  },
}

/** Custom panel: `FilterButton` as a Popover trigger around a checkbox list — use it when a menu is not enough. */
export const CustomFilterPopover: StoryObj<typeof FilterButton> = {
  parameters: openInIframe,
  render: () => <OwnerFilterDemo />,
}

function OwnerFilterDemo() {
  const owners = [...new Set(PROJECTS.map((p) => p.owner))]
  const [selected, setSelected] = React.useState<string[]>(['Jane Doe'])
  return (
    <div className="h-64">
      <Popover defaultOpen>
        <PopoverTrigger asChild>
          <FilterButton label="Owner" selected={selected} />
        </PopoverTrigger>
        <PopoverContent align="start" className="w-60 p-0">
          <fieldset className="flex flex-col py-1.5">
            <legend className="sr-only">Owner</legend>
            <div className="mono-label px-3 pt-1.5 pb-1 text-[11px]">Filter by owner</div>
            {owners.map((owner) => {
              const id = `owner-filter-${owner.replace(/\s+/g, '-').toLowerCase()}`
              return (
                <label
                  key={owner}
                  htmlFor={id}
                  className="mx-1.5 flex cursor-pointer items-center gap-2.5 rounded-[5px] px-1.5 py-1.5 text-[13px] text-foreground-light hover:bg-surface-200 hover:text-foreground"
                >
                  <Checkbox
                    id={id}
                    checked={selected.includes(owner)}
                    onCheckedChange={(on) =>
                      setSelected((s) => owners.filter((o) => (o === owner ? on === true : s.includes(o))))
                    }
                  />
                  <span className="flex-1">{owner}</span>
                  <span className="font-mono text-[11.5px] text-foreground-lighter tabular">
                    {PROJECTS.filter((p) => p.owner === owner).length}
                  </span>
                </label>
              )
            })}
          </fieldset>
          {selected.length > 0 && (
            <div className="border-t p-1.5">
              <Button variant="ghost" size="tiny" className="w-full justify-center" onClick={() => setSelected([])}>
                Clear filter
              </Button>
            </div>
          )}
        </PopoverContent>
      </Popover>
    </div>
  )
}

type Sort = 'updated' | 'name'

function ProjectsDemo(props: React.ComponentProps<typeof ListToolbar>) {
  const [query, setQuery] = React.useState('')
  const [statuses, setStatuses] = React.useState<string[]>([])
  const [plans, setPlans] = React.useState<string[]>([])
  const [sort, setSort] = React.useState<Sort>('updated')
  const [view, setView] = React.useState('list')

  const q = query.trim().toLowerCase()
  const rows = PROJECTS.filter(
    (p) =>
      (!q || p.name.toLowerCase().includes(q) || p.owner.toLowerCase().includes(q)) &&
      (statuses.length === 0 || statuses.includes(p.status)) &&
      (plans.length === 0 || plans.includes(p.plan)),
  ).sort((a, b) => (sort === 'name' ? a.name.localeCompare(b.name) : a.updated - b.updated))

  // The story's own actions, unless the `actions` arg provides others.
  const defaultActions = (
    <>
      <ToggleGroup
        type="single"
        variant="outline"
        value={view}
        onValueChange={(v) => v && setView(v)}
        aria-label="Layout"
      >
        <Hint label="Grid view">
          <ToggleGroupItem value="grid" aria-label="Grid view" className="px-2">
            <LayoutGrid />
          </ToggleGroupItem>
        </Hint>
        <Hint label="List view">
          <ToggleGroupItem value="list" aria-label="List view" className="px-2">
            <List />
          </ToggleGroupItem>
        </Hint>
      </ToggleGroup>
      <Button size="icon" aria-label="Export" icon={<Download />} />
      <Button variant="primary" icon={<Plus />}>
        New project
      </Button>
    </>
  )

  return (
    <div className="flex flex-col gap-4">
      <ListToolbar {...props} actions={props.actions ?? defaultActions}>
        <SearchInput value={query} onValueChange={setQuery} placeholder="Search projects" />
        <FilterMenu label="Status" options={STATUS_OPTIONS} value={statuses} onValueChange={setStatuses} />
        <FilterMenu label="Plan" options={PLAN_OPTIONS} value={plans} onValueChange={setPlans} />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button icon={<ArrowUpDown className="size-3.5" />} aria-label={`Sorted by ${sort === 'name' ? 'name' : 'last update'}. Change sort order`}>
              <span className="hidden lg:inline">Sorted by {sort === 'name' ? 'name' : 'last update'}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48">
            <DropdownMenuLabel>Sort by</DropdownMenuLabel>
            <DropdownMenuRadioGroup value={sort} onValueChange={(v) => setSort(v === 'name' ? 'name' : 'updated')}>
              <DropdownMenuRadioItem value="updated">Last update</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="name">Name</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </ListToolbar>

      <ul className="divide-y rounded-lg border bg-card">
        {rows.length === 0 ? (
          <li className="px-4 py-8 text-center text-sm text-foreground-light">No projects match your filters.</li>
        ) : (
          rows.map((p) => (
            <li key={p.name} className="flex items-center gap-3 px-4 py-2.5 text-sm">
              {dot(p.status)}
              <span className="min-w-0 flex-1 truncate text-foreground">{p.name}</span>
              <span className="hidden text-foreground-light sm:inline">{p.owner}</span>
              <span className="w-20 text-right font-mono text-[11.5px] text-foreground-lighter uppercase">{p.plan}</span>
            </li>
          ))
        )}
      </ul>
    </div>
  )
}
