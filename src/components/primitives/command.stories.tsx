import type { Meta, StoryObj } from '@storybook/react-vite'
import * as React from 'react'
import {
  Check,
  ChevronsUpDown,
  CreditCard,
  FileText,
  FolderKanban,
  KeyRound,
  LayoutDashboard,
  Plus,
  Search,
  Settings,
  UserPlus,
  Users,
} from 'lucide-react'
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test'

import { cn } from '../../lib/utils'
import { isMac, modKey } from '../../lib/platform'
import { Button } from './button'
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from './command'
import { Popover, PopoverContent, PopoverTrigger } from './popover'

/** Platform-aware shortcut label: "⌘N" on Apple platforms, "Ctrl+N" elsewhere. */
const shortcut = (key: string) => (isMac ? `⌘${key}` : `Ctrl+${key}`)

type CommandStoryArgs = React.ComponentProps<typeof Command> & {
  /** Story-only: called with the id of the item that was run. */
  onItemSelect?: (id: string) => void
}

/** Keeps overlay stories contained in their own frame on the docs page. */
const inFrame = (height: number) => ({ docs: { story: { inline: false, iframeHeight: `${height}px` } } })

/** Shared palette content: recent projects, actions and navigation. */
function PaletteItems({ onItemSelect }: { onItemSelect?: (id: string) => void }) {
  const run = (id: string) => () => onItemSelect?.(id)
  return (
    <>
      <CommandEmpty>No results found.</CommandEmpty>
      <CommandGroup heading="Projects">
        <CommandItem onSelect={run('project:website-redesign')}>
          <FolderKanban />
          Website redesign
        </CommandItem>
        <CommandItem onSelect={run('project:mobile-app')}>
          <FolderKanban />
          Mobile app launch
        </CommandItem>
        <CommandItem onSelect={run('project:q3-planning')} keywords={['roadmap', 'okr']}>
          <FolderKanban />
          Q3 planning
        </CommandItem>
      </CommandGroup>
      <CommandSeparator />
      <CommandGroup heading="Actions">
        <CommandItem onSelect={run('new-project')}>
          <Plus />
          Create project
          <CommandShortcut>{shortcut('N')}</CommandShortcut>
        </CommandItem>
        <CommandItem onSelect={run('invite-member')}>
          <UserPlus />
          Invite teammate
          <CommandShortcut>{shortcut('I')}</CommandShortcut>
        </CommandItem>
        <CommandItem onSelect={run('new-api-key')} disabled>
          <KeyRound />
          Generate API key
        </CommandItem>
      </CommandGroup>
      <CommandSeparator />
      <CommandGroup heading="Navigation">
        <CommandItem onSelect={run('dashboard')}>
          <LayoutDashboard />
          Go to dashboard
        </CommandItem>
        <CommandItem onSelect={run('billing')} keywords={['invoices', 'payment', 'plan']}>
          <CreditCard />
          Go to billing
        </CommandItem>
        <CommandItem onSelect={run('team')}>
          <Users />
          Go to team
        </CommandItem>
        <CommandItem onSelect={run('settings')}>
          <Settings />
          Open settings
          <CommandShortcut>{shortcut(',')}</CommandShortcut>
        </CommandItem>
      </CommandGroup>
    </>
  )
}

const meta = {
  title: 'Primitives/Command',
  component: Command,
  subcomponents: {
    CommandDialog,
    CommandInput,
    CommandList,
    CommandEmpty,
    CommandGroup,
    CommandItem,
    CommandSeparator,
    CommandShortcut,
  },
  parameters: {
    docs: {
      description: {
        component:
          'Searchable, keyboard-navigable command list (cmdk). Embed `Command` inline for searchable pickers (e.g. inside a Popover) and use `CommandDialog` for an app-wide command palette opened with mod+K. Items are fuzzy-filtered by text, `value` and `keywords`; pass `shouldFilter={false}` to filter yourself. For short action lists without search use Dropdown Menu.',
      },
    },
  },
  args: {
    label: 'Command menu',
    loop: false,
    shouldFilter: true,
    onValueChange: fn(),
    onItemSelect: fn(),
  },
  argTypes: {
    label: { control: 'text' },
    loop: { control: 'boolean' },
    shouldFilter: { control: 'boolean' },
    disablePointerSelection: { control: 'boolean' },
    vimBindings: { control: 'boolean' },
    filter: { control: false },
    children: { control: false },
    asChild: { control: false },
    onItemSelect: { control: false },
  },
  render: ({ onItemSelect, className, ...args }) => (
    <Command {...args} className={cn('w-[26rem] max-w-full border border-border-strong shadow-overlay', className)}>
      <CommandInput placeholder="Type a command or search…" />
      <CommandList>
        <PaletteItems onItemSelect={onItemSelect} />
      </CommandList>
    </Command>
  ),
} satisfies Meta<CommandStoryArgs>

export default meta
type Story = StoryObj<typeof meta>

/** Inline palette: type to filter, arrows to move, Enter to run. "Generate API key" is disabled. */
export const Default: Story = {}

/** `loop` wraps arrow navigation from the last item back to the first (CommandDialog enables it). */
export const Looping: Story = {
  args: { loop: true },
}

function NoResultsDemo(props: CommandStoryArgs) {
  const [query, setQuery] = React.useState('quarterly board deck')
  const { onItemSelect, className, ...rest } = props
  return (
    <Command {...rest} className={cn('w-[26rem] max-w-full border border-border-strong shadow-overlay', className)}>
      <CommandInput value={query} onValueChange={setQuery} placeholder="Type a command or search…" />
      <CommandList>
        <PaletteItems onItemSelect={onItemSelect} />
      </CommandList>
    </Command>
  )
}

/** Empty state: `CommandEmpty` renders when nothing matches the query. */
export const NoResults: Story = {
  render: (args) => <NoResultsDemo {...args} />,
}

const invoices = [
  { id: 'INV-2041', customer: 'Northwind Trading', amount: '$4,200.00' },
  { id: 'INV-2042', customer: 'Acme Corp', amount: '$860.00' },
  { id: 'INV-2043', customer: 'Globex Logistics', amount: '$12,940.50' },
  { id: 'INV-2044', customer: 'Initech', amount: '$1,315.00' },
  { id: 'INV-2045', customer: 'Umbrella Health', amount: '$7,020.00' },
]

function ManualFilteringDemo(props: CommandStoryArgs) {
  const [query, setQuery] = React.useState('')
  const { onItemSelect, className, ...rest } = props
  const q = query.trim().toLowerCase()
  const results = invoices.filter((inv) => !q || `${inv.id} ${inv.customer}`.toLowerCase().includes(q))
  return (
    <Command
      {...rest}
      shouldFilter={false}
      className={cn('w-[26rem] max-w-full border border-border-strong shadow-overlay', className)}
    >
      <CommandInput value={query} onValueChange={setQuery} placeholder="Search invoices by number or customer…" />
      <CommandList>
        <CommandEmpty>No invoice matches “{query}”.</CommandEmpty>
        {results.length > 0 && (
          <CommandGroup heading={`Invoices · ${results.length}`}>
            {results.map((inv) => (
              <CommandItem key={inv.id} value={inv.id} onSelect={() => onItemSelect?.(inv.id)}>
                <FileText />
                <span className="font-mono text-xs text-foreground-lighter">{inv.id}</span>
                <span className="truncate">{inv.customer}</span>
                <span className="tabular ml-auto text-xs text-foreground-lighter">{inv.amount}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        )}
      </CommandList>
    </Command>
  )
}

/** `shouldFilter={false}`: you own the filtering (e.g. server-side search) and render only the matches. */
export const ManualFiltering: Story = {
  render: (args) => <ManualFilteringDemo {...args} />,
}

const timezones = [
  'Pacific/Honolulu',
  'America/Anchorage',
  'America/Los_Angeles',
  'America/Denver',
  'America/Chicago',
  'America/New_York',
  'America/Sao_Paulo',
  'Atlantic/Azores',
  'Europe/London',
  'Europe/Paris',
  'Europe/Berlin',
  'Europe/Athens',
  'Africa/Nairobi',
  'Asia/Dubai',
  'Asia/Kolkata',
  'Asia/Bangkok',
  'Asia/Singapore',
  'Asia/Tokyo',
  'Australia/Sydney',
  'Pacific/Auckland',
]

function TimezonePickerDemo({ defaultOpen = false }: { defaultOpen?: boolean }) {
  const [open, setOpen] = React.useState(defaultOpen)
  const [value, setValue] = React.useState('Europe/Paris')
  return (
    <div className="flex w-64 flex-col gap-1.5">
      <span className="text-[13px] text-foreground-light">Timezone</span>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            role="combobox"
            aria-expanded={open}
            iconRight={<ChevronsUpDown className="text-foreground-lighter" />}
            className="w-full justify-between font-normal"
          >
            {value}
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-64 p-0">
          <Command>
            <CommandInput placeholder="Search timezone…" />
            <CommandList className="max-h-60">
              <CommandEmpty>No timezone found.</CommandEmpty>
              <CommandGroup>
                {timezones.map((tz) => (
                  <CommandItem
                    key={tz}
                    value={tz}
                    keywords={[tz.replace('_', ' ')]}
                    onSelect={() => {
                      setValue(tz)
                      setOpen(false)
                    }}
                  >
                    <Check className={cn('text-foreground', tz === value ? 'opacity-100' : 'opacity-0')} />
                    {tz.replace('_', ' ')}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}

/** Composition: a searchable picker (combobox) built from Popover + an inline Command with a long, scrolling list. */
export const SearchablePicker: Story = {
  parameters: { layout: 'padded', ...inFrame(400) },
  render: () => <TimezonePickerDemo defaultOpen />,
}

/** Picker by keyboard: typing narrows the list, Enter picks the highlighted timezone and closes the popover. */
export const PickerInteraction: Story = {
  parameters: { layout: 'padded', ...inFrame(400) },
  render: () => <TimezonePickerDemo />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const trigger = canvas.getByRole('combobox')
    await expect(trigger).toHaveTextContent('Europe/Paris')
    await userEvent.click(trigger)
    const input = await screen.findByPlaceholderText('Search timezone…')
    await waitFor(() => expect(input).toHaveFocus())
    await userEvent.type(input, 'tokyo')
    await waitFor(() => expect(screen.queryByText('Europe/Berlin')).toBeNull())
    await userEvent.keyboard('{Enter}')
    await waitFor(() => expect(trigger).toHaveTextContent('Asia/Tokyo'))
    await waitFor(() => expect(trigger).toHaveAttribute('aria-expanded', 'false'))
  },
}

function CommandPaletteDemo({
  defaultOpen = false,
  onItemSelect,
  showCloseButton,
  closeLabel,
}: {
  defaultOpen?: boolean
  onItemSelect?: (id: string) => void
  showCloseButton?: boolean
  closeLabel?: string
}) {
  const [open, setOpen] = React.useState(defaultOpen)
  React.useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === 'k' && (event.metaKey || event.ctrlKey)) {
        event.preventDefault()
        setOpen((o) => !o)
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [])
  return (
    <>
      <Button icon={<Search />} onClick={() => setOpen(true)} className="w-60 justify-start text-foreground-lighter">
        Search…
        <span className="ml-auto font-mono text-[11px] tracking-widest text-foreground-lighter">{modKey} K</span>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen} showCloseButton={showCloseButton} closeLabel={closeLabel}>
        <CommandInput placeholder="Type a command or search…" />
        <CommandList>
          <PaletteItems
            onItemSelect={(id) => {
              onItemSelect?.(id)
              setOpen(false)
            }}
          />
        </CommandList>
      </CommandDialog>
    </>
  )
}

/** `CommandDialog`: the app-wide palette. Click the button or press mod+K; selecting an item runs it and closes the dialog. */
export const Dialog: Story = {
  parameters: inFrame(560),
  render: ({ onItemSelect }) => <CommandPaletteDemo onItemSelect={onItemSelect} />,
}

/** CommandDialog opened by default for visual review. */
export const DialogOpen: Story = {
  parameters: inFrame(560),
  render: ({ onItemSelect }) => <CommandPaletteDemo defaultOpen onItemSelect={onItemSelect} />,
}

/**
 * `showCloseButton={false}` removes the top-right close (X) button: the palette then closes with
 * Escape, a click outside or by running an item. Keep the button (and translate its name with
 * `closeLabel`) unless the dialog is very compact.
 */
export const DialogWithoutCloseButton: Story = {
  parameters: inFrame(560),
  render: ({ onItemSelect }) => <CommandPaletteDemo defaultOpen showCloseButton={false} onItemSelect={onItemSelect} />,
  play: async () => {
    const dialog = await screen.findByRole('dialog', { name: 'Command Palette' })
    await expect(within(dialog).queryByRole('button', { name: /close/i })).not.toBeInTheDocument()
    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(dialog).toHaveAttribute('data-state', 'closed'))
  },
}

/** `closeLabel` translates the accessible name of the close (X) button (default "Close"). */
export const DialogCloseLabel: Story = {
  parameters: inFrame(560),
  render: ({ onItemSelect }) => <CommandPaletteDemo defaultOpen closeLabel="Fermer" onItemSelect={onItemSelect} />,
  play: async () => {
    const dialog = await screen.findByRole('dialog', { name: 'Command Palette' })
    await userEvent.click(within(dialog).getByRole('button', { name: 'Fermer' }))
    await waitFor(() => expect(dialog).toHaveAttribute('data-state', 'closed'))
  },
}

/** Typing filters items (groups without matches disappear); Enter runs the highlighted item. */
export const FilterAndSelect: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByPlaceholderText('Type a command or search…')
    await userEvent.type(input, 'invite')
    await waitFor(() => expect(canvas.getByText('Invite teammate')).toBeInTheDocument())
    await expect(canvas.queryByText('Go to billing')).toBeNull()
    await userEvent.keyboard('{Enter}')
    await expect(args.onItemSelect).toHaveBeenCalledWith('invite-member')
  },
}

/** Keywords widen matching: "invoices" finds "Go to billing" inside the dialog, and Enter runs it and closes the palette. */
export const DialogInteraction: Story = {
  parameters: inFrame(560),
  render: ({ onItemSelect }) => <CommandPaletteDemo onItemSelect={onItemSelect} />,
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: /Search/ }))
    const dialog = await screen.findByRole('dialog')
    const input = within(dialog).getByPlaceholderText('Type a command or search…')
    await waitFor(() => expect(input).toHaveFocus())
    await userEvent.type(input, 'invoices')
    await waitFor(() => expect(within(dialog).getByText('Go to billing')).toBeInTheDocument())
    await userEvent.keyboard('{Enter}')
    await expect(args.onItemSelect).toHaveBeenCalledWith('billing')
    // Assert on state rather than removal so the check does not depend on the exit animation.
    await waitFor(() => expect(dialog).toHaveAttribute('data-state', 'closed'))
  },
}


const people = [
  { name: 'Olivia Martin', email: 'olivia@acme.com' },
  { name: 'Jackson Lee', email: 'jackson@acme.com' },
  { name: 'Isabella Nguyen', email: 'isabella@acme.com' },
  { name: 'William Kim', email: 'will@acme.com' },
  { name: 'Sofia Davis', email: 'sofia@acme.com' },
]

/** Stands in for a search endpoint: answers after a short delay. */
function searchPeople(query: string) {
  const q = query.trim().toLowerCase()
  return new Promise<typeof people>((resolve) =>
    setTimeout(() => resolve(people.filter((p) => `${p.name} ${p.email}`.toLowerCase().includes(q))), 150),
  )
}

function ServerSearchPaletteDemo({
  defaultOpen = false,
  onItemSelect,
}: {
  defaultOpen?: boolean
  onItemSelect?: (id: string) => void
}) {
  const [open, setOpen] = React.useState(defaultOpen)
  const [query, setQuery] = React.useState('')
  const [response, setResponse] = React.useState({ query: '', results: people })
  React.useEffect(() => {
    let active = true
    searchPeople(query).then((results) => {
      if (active) setResponse({ query, results })
    })
    return () => {
      active = false
    }
  }, [query])
  const loading = response.query !== query
  return (
    <>
      <Button icon={<Users />} onClick={() => setOpen(true)}>
        Find a teammate
      </Button>
      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        title="Find a teammate"
        description="Search team members by name or email"
        commandProps={{ shouldFilter: false, label: 'Find a teammate' }}
      >
        <CommandInput value={query} onValueChange={setQuery} placeholder="Search by name or email…" />
        <CommandList>
          {loading ? (
            <div className="py-8 text-center text-sm text-foreground-lighter">Searching…</div>
          ) : (
            <CommandEmpty>No teammate matches “{query}”.</CommandEmpty>
          )}
          {!loading && response.results.length > 0 && (
            <CommandGroup heading="Team members">
              {response.results.map((person) => (
                <CommandItem
                  key={person.email}
                  value={person.email}
                  onSelect={() => {
                    onItemSelect?.(person.email)
                    setOpen(false)
                  }}
                >
                  <Users />
                  {person.name}
                  <span className="ml-auto truncate text-xs text-foreground-lighter">{person.email}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </CommandList>
      </CommandDialog>
    </>
  )
}

/**
 * Server-side search in the palette: `commandProps={{ shouldFilter: false }}` turns off cmdk's own
 * filtering so the list shows exactly what the (fake) endpoint returns, with a "Searching…" row
 * while a request is in flight. `title` / `description` name the dialog for screen readers.
 */
export const DialogServerSearch: Story = {
  parameters: inFrame(480),
  render: ({ onItemSelect }) => <ServerSearchPaletteDemo onItemSelect={onItemSelect} />,
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: 'Find a teammate' }))
    const dialog = await screen.findByRole('dialog', { name: 'Find a teammate' })
    const input = within(dialog).getByPlaceholderText('Search by name or email…')
    await waitFor(() => expect(input).toHaveFocus())
    await userEvent.type(input, 'sofia')
    await expect(await within(dialog).findByText('Sofia Davis')).toBeInTheDocument()
    await expect(within(dialog).queryByText('Olivia Martin')).toBeNull()
    await waitFor(() => expect(within(dialog).getByRole('option', { name: /Sofia Davis/ })).toHaveAttribute('aria-selected', 'true'))
    await userEvent.keyboard('{Enter}')
    await expect(args.onItemSelect).toHaveBeenCalledWith('sofia@acme.com')
    await waitFor(() => expect(dialog).toHaveAttribute('data-state', 'closed'))
  },
}
