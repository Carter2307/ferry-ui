import * as React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { CreditCard, Landmark, Wallet } from 'lucide-react'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'

import { Button } from './button'
import { Label } from './label'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from './select'

const LANGUAGES = [
  { value: 'en', label: 'English' },
  { value: 'fr', label: 'French' },
  { value: 'de', label: 'German' },
  { value: 'es', label: 'Spanish' },
  { value: 'ja', label: 'Japanese' },
] as const

/** Stories that render the popup open are shown in their own iframe on the docs page (an open select locks the page). */
const openInIframe = { docs: { story: { inline: false, iframeHeight: 320 } } }

const meta = {
  title: 'Primitives/Select',
  component: Select,
  subcomponents: {
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
    SelectGroup,
    SelectLabel,
    SelectSeparator,
    SelectScrollUpButton,
    SelectScrollDownButton,
  },
  parameters: {
    docs: {
      description: {
        component:
          'Pick one value from a short, known list (about 4–15 options). The trigger shares `Input` heights (`tiny` 26 · `sm` 30 · `md` 34px) and is `w-fit` by default; add `w-full` in forms. Use `RadioGroup` for 2–5 always-visible options, a Command-based combobox for long or searchable lists, and `DropdownMenu` for actions.',
      },
    },
  },
  args: {
    onValueChange: fn(),
    onOpenChange: fn(),
  },
  argTypes: {
    value: { control: 'select', options: [undefined, ...LANGUAGES.map((language) => language.value)] },
    defaultValue: { control: 'select', options: [undefined, ...LANGUAGES.map((language) => language.value)] },
    disabled: { control: 'boolean' },
    required: { control: 'boolean' },
    open: { control: 'boolean' },
    defaultOpen: { control: 'boolean' },
    children: { control: false },
  },
  render: (args) => (
    <Select {...args}>
      <SelectTrigger className="w-60" aria-label="Language">
        <SelectValue placeholder="Select a language" />
      </SelectTrigger>
      <SelectContent>
        {LANGUAGES.map((language) => (
          <SelectItem key={language.value} value={language.value}>
            {language.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  ),
} satisfies Meta<typeof Select>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithValue: Story = {
  args: { defaultValue: 'de' },
}

export const Open: Story = {
  args: { defaultValue: 'de', defaultOpen: true },
  parameters: openInIframe,
}

export const Sizes: Story = {
  render: (args) => (
    <div className="flex items-center gap-2">
      {(['tiny', 'sm', 'md'] as const).map((size) => (
        <Select key={size} {...args} defaultValue="30d">
          <SelectTrigger size={size} aria-label={`Date range (${size})`}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="24h">Last 24 hours</SelectItem>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
          </SelectContent>
        </Select>
      ))}
    </div>
  ),
}

/** `SelectGroup` + `SelectLabel` headings, `SelectSeparator` between groups. */
export const Groups: Story = {
  args: { defaultValue: 'europe-paris', defaultOpen: true },
  parameters: { docs: { story: { inline: false, iframeHeight: 420 } } },
  render: (args) => (
    <Select {...args}>
      <SelectTrigger className="w-64" aria-label="Timezone">
        <SelectValue placeholder="Select a timezone" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Americas</SelectLabel>
          <SelectItem value="america-new-york">New York (UTC−05:00)</SelectItem>
          <SelectItem value="america-chicago">Chicago (UTC−06:00)</SelectItem>
          <SelectItem value="america-los-angeles">Los Angeles (UTC−08:00)</SelectItem>
        </SelectGroup>
        <SelectSeparator />
        <SelectGroup>
          <SelectLabel>Europe</SelectLabel>
          <SelectItem value="europe-london">London (UTC+00:00)</SelectItem>
          <SelectItem value="europe-paris">Paris (UTC+01:00)</SelectItem>
          <SelectItem value="europe-berlin">Berlin (UTC+01:00)</SelectItem>
        </SelectGroup>
        <SelectSeparator />
        <SelectGroup>
          <SelectLabel>Asia Pacific</SelectLabel>
          <SelectItem value="asia-tokyo">Tokyo (UTC+09:00)</SelectItem>
          <SelectItem value="australia-sydney">Sydney (UTC+10:00)</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  ),
}

/** Leading icons in items are sized and muted automatically, and carried into the trigger. */
export const WithIcons: Story = {
  args: { defaultValue: 'card' },
  render: (args) => (
    <Select {...args}>
      <SelectTrigger className="w-56" aria-label="Payment method">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="card">
          <CreditCard />
          Credit card
        </SelectItem>
        <SelectItem value="transfer">
          <Landmark />
          Bank transfer
        </SelectItem>
        <SelectItem value="wallet">
          <Wallet />
          Digital wallet
        </SelectItem>
      </SelectContent>
    </Select>
  ),
}

export const DisabledItems: Story = {
  args: { defaultValue: 'member', defaultOpen: true },
  parameters: openInIframe,
  render: (args) => (
    <Select {...args}>
      <SelectTrigger className="w-48" aria-label="Role">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="viewer">Viewer</SelectItem>
        <SelectItem value="member">Member</SelectItem>
        <SelectItem value="admin">Admin</SelectItem>
        <SelectItem value="owner" disabled>
          Owner (transfer only)
        </SelectItem>
      </SelectContent>
    </Select>
  ),
}

export const Disabled: Story = {
  args: { disabled: true, defaultValue: 'en' },
}

/** `position="popper"` drops the list under the trigger instead of overlapping it. */
export const PopperPosition: Story = {
  args: { defaultValue: 'fr', defaultOpen: true },
  parameters: openInIframe,
  render: (args) => (
    <Select {...args}>
      <SelectTrigger className="w-60" aria-label="Language">
        <SelectValue />
      </SelectTrigger>
      <SelectContent position="popper" sideOffset={4}>
        {LANGUAGES.map((language) => (
          <SelectItem key={language.value} value={language.value}>
            {language.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  ),
}

const CURRENCIES = [
  'USD — US dollar',
  'EUR — Euro',
  'GBP — British pound',
  'JPY — Japanese yen',
  'CHF — Swiss franc',
  'CAD — Canadian dollar',
  'AUD — Australian dollar',
  'NZD — New Zealand dollar',
  'SEK — Swedish krona',
  'NOK — Norwegian krone',
  'DKK — Danish krone',
  'PLN — Polish złoty',
  'CZK — Czech koruna',
  'SGD — Singapore dollar',
  'HKD — Hong Kong dollar',
  'INR — Indian rupee',
  'BRL — Brazilian real',
  'MXN — Mexican peso',
  'ZAR — South African rand',
  'KRW — South Korean won',
]

/**
 * Overflowing lists scroll, with chevron buttons at the edges. `SelectContent` renders
 * `SelectScrollUpButton` / `SelectScrollDownButton` automatically when the list overflows; they
 * are exported only for custom wrappers.
 */
export const LongList: Story = {
  args: { defaultValue: 'CHF', defaultOpen: true },
  parameters: { docs: { story: { inline: false, iframeHeight: 360 } } },
  render: (args) => (
    <Select {...args}>
      <SelectTrigger className="w-56" aria-label="Currency">
        <SelectValue />
      </SelectTrigger>
      <SelectContent className="max-h-64">
        {CURRENCIES.map((currency) => {
          const code = currency.slice(0, 3)
          return (
            <SelectItem key={code} value={code}>
              {currency}
            </SelectItem>
          )
        })}
      </SelectContent>
    </Select>
  ),
}

/** Long values stay on one line and are clipped (no ellipsis) inside a fixed-width trigger; the chevron stays visible. */
export const Truncation: Story = {
  args: { defaultValue: 'long' },
  render: (args) => (
    <Select {...args}>
      <SelectTrigger className="w-44" aria-label="Project">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="long">Customer onboarding revamp for enterprise accounts</SelectItem>
        <SelectItem value="short">Website</SelectItem>
      </SelectContent>
    </Select>
  ),
}

/** Label on top, `aria-invalid` trigger and an announced error line. */
export const Invalid: Story = {
  render: (args) => (
    <div className="flex w-64 flex-col gap-1.5">
      <Label htmlFor="invoice-currency" className="text-[13px]">
        Invoice currency
      </Label>
      <Select {...args}>
        <SelectTrigger id="invoice-currency" className="w-full" aria-invalid aria-describedby="invoice-currency-error">
          <SelectValue placeholder="Select a currency" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="usd">USD — US dollar</SelectItem>
          <SelectItem value="eur">EUR — Euro</SelectItem>
          <SelectItem value="gbp">GBP — British pound</SelectItem>
        </SelectContent>
      </Select>
      <p id="invoice-currency-error" role="alert" className="text-[12.5px] text-destructive">
        Choose a currency before sending the invoice.
      </p>
    </div>
  ),
}

function InviteWithRoleForm() {
  const [role, setRole] = React.useState('')
  const [error, setError] = React.useState<string | null>(null)
  const [saved, setSaved] = React.useState<string | null>(null)
  const id = React.useId()

  return (
    <form
      noValidate
      className="flex w-96 flex-col gap-4 rounded-lg border bg-card p-5 shadow-card"
      onSubmit={(event) => {
        event.preventDefault()
        if (!role) {
          setError('Pick a role for this member.')
          return
        }
        setError(null)
        setSaved(role)
      }}
    >
      <div className="flex flex-col gap-0.5">
        <h3 className="text-sm font-medium text-foreground">Change role</h3>
        <p className="text-[13px] text-foreground-light">Jane Cooper · jane@acme.com</p>
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor={`${id}-role`} className="text-[13px]">
          Role
        </Label>
        <Select
          value={role}
          onValueChange={(value) => {
            setRole(value)
            setError(null)
          }}
        >
          <SelectTrigger
            id={`${id}-role`}
            className="w-full"
            aria-invalid={error ? true : undefined}
            aria-describedby={`${id}-${error ? 'error' : 'hint'}`}
          >
            <SelectValue placeholder="Select a role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="viewer">Viewer</SelectItem>
            <SelectItem value="member">Member</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
          </SelectContent>
        </Select>
        {error ? (
          <p id={`${id}-error`} role="alert" className="text-[12.5px] text-destructive">
            {error}
          </p>
        ) : (
          <p id={`${id}-hint`} className="text-[12.5px] text-foreground-lighter">
            Admins can manage billing and members.
          </p>
        )}
      </div>
      <div className="flex items-center justify-between gap-3">
        <p role="status" className="text-[12.5px] text-success">
          {saved && `Role updated to ${saved}.`}
        </p>
        <Button type="submit" variant="primary">
          Save
        </Button>
      </div>
    </form>
  )
}

/** Realistic form: labelled full-width trigger, helper text, required validation, keyboard selection. */
export const InForm: Story = {
  render: () => <InviteWithRoleForm />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const body = within(canvasElement.ownerDocument.body)

    await userEvent.click(canvas.getByRole('button', { name: 'Save' }))
    await expect(await canvas.findByRole('alert')).toHaveTextContent('Pick a role')

    const trigger = canvas.getByRole('combobox', { name: 'Role' })
    trigger.focus()
    await userEvent.keyboard('{Enter}')
    const admin = await body.findByRole('option', { name: 'Admin' })
    admin.focus()
    await userEvent.keyboard('{Enter}')

    await waitFor(() => expect(trigger).toHaveTextContent('Admin'))
    // The rest of the page is aria-hidden / inert until the popup's exit animation ends.
    await waitFor(() => expect(body.queryByRole('listbox')).toBeNull())
    await expect(canvas.queryByRole('alert')).toBeNull()
    await userEvent.click(canvas.getByRole('button', { name: 'Save' }))
    await expect(canvas.getByRole('status')).toHaveTextContent('Role updated to admin.')
  },
}

/** Opens with the keyboard, moves with arrows and selects with Enter (works in the browser and in jsdom). */
export const KeyboardSelection: Story = {
  args: { defaultValue: 'en' },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const body = within(canvasElement.ownerDocument.body)
    const trigger = canvas.getByRole('combobox', { name: 'Language' })

    trigger.focus()
    await userEvent.keyboard('{ArrowDown}')
    await expect(await body.findByRole('listbox')).toBeInTheDocument()
    await expect(args.onOpenChange).toHaveBeenCalledWith(true)

    await waitFor(() => expect(body.getByRole('option', { name: 'English' })).toHaveFocus())
    await userEvent.keyboard('{ArrowDown}')
    await waitFor(() => expect(body.getByRole('option', { name: 'French' })).toHaveFocus())
    await userEvent.keyboard('{Enter}')

    await expect(args.onValueChange).toHaveBeenCalledWith('fr')
    await waitFor(() => expect(trigger).toHaveTextContent('French'))
    await waitFor(() => expect(body.queryByRole('listbox')).toBeNull())
  },
}
