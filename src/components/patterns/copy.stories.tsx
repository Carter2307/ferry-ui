import * as React from 'react'
import type { ArgTypes, Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test'

import { Card, CardContent, CardHeader, CardTitle } from '../primitives/card'
import { Label } from '../primitives/label'
import { Toaster, toast } from '../primitives/sonner'
import { Switch } from '../primitives/switch'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../primitives/table'

import { CodeBlock } from './code-block'
import { CopyButton, CopyField, SecretField, type CopyLabels } from './copy'

/**
 * Replaces the clipboard with a spy for the duration of a story, so copy interactions are
 * deterministic in the browser (no permission prompt) and in jsdom (which has no clipboard).
 */
function mockClipboard() {
  const writeText = fn(async (_text: string) => {}).mockName('clipboard.writeText')
  const nav = window.navigator
  const ownSecure = Object.getOwnPropertyDescriptor(window, 'isSecureContext')
  const forceSecure = !window.isSecureContext
  Object.defineProperty(nav, 'clipboard', { configurable: true, value: { writeText } })
  if (forceSecure) Object.defineProperty(window, 'isSecureContext', { configurable: true, value: true })
  return () => {
    Reflect.deleteProperty(nav, 'clipboard')
    if (!forceSecure) return
    if (ownSecure) Object.defineProperty(window, 'isSecureContext', ownSecure)
    else Reflect.deleteProperty(window, 'isSecureContext')
  }
}

/** The clipboard spy installed by {@link mockClipboard}. */
const clipboardSpy = () => window.navigator.clipboard.writeText as ReturnType<typeof fn>

/** Hides controls that the meta declares but a subcomponent story does not use. */
const hideControls = (...names: string[]): ArgTypes =>
  Object.fromEntries(names.map((name) => [name, { table: { disable: true } }]))

/** Controls that only make sense on `CopyButton`: hidden on the CopyField / SecretField stories. */
const hideButtonControls = hideControls('label', 'variant', 'icon', 'iconRight', 'asChild')

const meta = {
  title: 'Patterns/Copy',
  component: CopyButton,
  subcomponents: { CopyField, SecretField },
  parameters: {
    docs: {
      description: {
        component:
          'Copy-to-clipboard building blocks. `CopyButton` is the small outlined button (icon-only with a tooltip, or labelled "Copy") that confirms with a check for 1.5s; `CopyField` is a read-only value box with an inline Copy; `SecretField` masks a credential behind Reveal / Hide. Always say what is copied through `what` ("Copy API key"). Failures raise an error toast, so mount `<Toaster />` once in the app; a success is announced to screen readers by a hidden live region. Every built-in text ("Copy", "Copied", "Reveal", "Hide") can be translated through `labels`. For commands and snippets use `CodeBlock`.',
      },
    },
  },
  args: {
    value: 'INV-2026-0142',
    what: 'invoice number',
    onCopy: fn(),
  },
  argTypes: {
    label: { control: 'text' },
    variant: { control: 'select', options: ['default', 'outline', 'ghost'] },
    size: { control: 'select', options: ['tiny', 'icon-tiny', 'icon', 'sm'] },
    icon: { control: false },
    iconRight: { control: false },
    asChild: { control: false },
    labels: { control: false },
  },
  beforeEach: mockClipboard,
} satisfies Meta<typeof CopyButton>

export default meta
type Story = StoryObj<typeof meta>

/** Icon-only (the default): `icon-tiny` button with a `Copy <what>` tooltip and accessible name. */
export const Default: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    // Nothing is announced before the copy.
    await expect(canvas.getByRole('status')).toBeEmptyDOMElement()
    await userEvent.click(canvas.getByRole('button', { name: 'Copy invoice number' }))
    await waitFor(() => expect(args.onCopy).toHaveBeenCalledWith('INV-2026-0142'))
    await expect(clipboardSpy()).toHaveBeenCalledWith('INV-2026-0142')
    // The icon-only button keeps its name: the hidden live region announces the success.
    await waitFor(() => expect(canvas.getByRole('status')).toHaveTextContent('Copied'))
  },
}

/** With `label`, the button shows text ("Copy" → "Copied") and no tooltip; `what` completes its accessible name. */
export const WithLabel: Story = {
  args: { label: 'Copy' },
}

export const Variants: Story = {
  render: (args) => (
    <div className="flex items-center gap-2">
      <CopyButton {...args} variant="default" />
      <CopyButton {...args} variant="outline" />
      <CopyButton {...args} variant="ghost" />
      <CopyButton {...args} label="Copy" />
      <CopyButton {...args} label="Copy" variant="ghost" />
    </div>
  ),
}

/** Next to an identifier in a heading or a table cell: use `variant="ghost"` so it stays quiet. */
export const InlineWithValue: Story = {
  args: { value: 'ord_8f2c41d9a7', what: 'order ID', variant: 'ghost' },
  parameters: { layout: 'padded' },
  render: (args) => (
    <Table containerClassName="max-w-lg">
      <TableHeader>
        <TableRow>
          <TableHead>Order</TableHead>
          <TableHead>Customer</TableHead>
          <TableHead className="text-right">Total</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {[
          { id: 'ord_8f2c41d9a7', customer: 'Northwind Traders', total: '$1,280.00' },
          { id: 'ord_31be07c2f4', customer: 'Globex Corporation', total: '$94.50' },
        ].map((order) => (
          <TableRow key={order.id}>
            <TableCell>
              <span className="flex items-center gap-1">
                <span className="font-mono text-[13px]">{order.id}</span>
                <CopyButton {...args} value={order.id} />
              </span>
            </TableCell>
            <TableCell>{order.customer}</TableCell>
            <TableCell className="text-right tabular">{order.total}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
}

export const Disabled: Story = {
  args: { label: 'Copy', disabled: true },
}

/** Clicking copies the value, calls `onCopy`, flips the label to "Copied" for 1.5s and announces it (`role="status"`). */
export const ClickToCopy: Story = {
  args: { label: 'Copy' },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: 'Copy invoice number' }))
    await waitFor(() => expect(args.onCopy).toHaveBeenCalledWith('INV-2026-0142'))
    await expect(clipboardSpy()).toHaveBeenCalledWith('INV-2026-0142')
    await expect(await canvas.findByRole('button', { name: 'Copied' })).toHaveAttribute('data-copied', 'true')
    await expect(canvas.getByRole('status')).toHaveTextContent('Copied')
  },
}

/** Dismisses the toasts on mount and unmount: sonner replays active toasts to every new Toaster. */
function ResetToasts({ children }: { children: React.ReactNode }) {
  React.useLayoutEffect(() => {
    toast.dismiss()
    return () => {
      toast.dismiss()
    }
  }, [])
  return children
}

/**
 * Error state: when the clipboard is unavailable (permission denied, old browser), an error toast
 * explains it and the button does not flip to "Copied". `onCopy` still fires (it reports attempts).
 */
export const CopyFailed: Story = {
  args: { label: 'Copy' },
  parameters: { docs: { story: { inline: false, iframeHeight: 220 } } },
  beforeEach: () => {
    const writeText = fn(async (_text: string) => {
      throw new Error('Clipboard permission denied')
    })
    Object.defineProperty(window.navigator, 'clipboard', { configurable: true, value: { writeText } })
    // Also defeat the hidden-textarea fallback.
    Object.defineProperty(document, 'execCommand', { configurable: true, value: () => false })
    return () => {
      Reflect.deleteProperty(document, 'execCommand')
    }
  },
  render: (args) => (
    <ResetToasts>
      <CopyButton {...args} />
      <Toaster />
    </ResetToasts>
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: 'Copy invoice number' }))
    await expect(await screen.findByText('Could not copy to the clipboard')).toBeInTheDocument()
    await waitFor(() => expect(args.onCopy).toHaveBeenCalledWith('INV-2026-0142'))
    await expect(canvas.queryByRole('button', { name: 'Copied' })).not.toBeInTheDocument()
    await expect(canvas.getByRole('status')).toBeEmptyDOMElement()
  },
}

/** `CopyField`, driven by the controls: a read-only value with an inline Copy; focusing the input selects the text. */
export const Field: StoryObj<typeof CopyField> = {
  parameters: { layout: 'padded' },
  args: { id: 'project-id', value: 'prj_7Hq2kLx9Vd3mN4', what: 'project ID', mono: true, size: 'md' },
  argTypes: {
    ...hideButtonControls,
    size: { control: 'inline-radio', options: ['sm', 'md'] },
    mono: { control: 'boolean' },
  },
  render: (args) => (
    <div className="flex max-w-md flex-col gap-1.5">
      <Label htmlFor={args.id}>Project ID</Label>
      <CopyField {...args} />
    </div>
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByLabelText('Project ID')
    await expect(input).toHaveAttribute('readonly')
    await userEvent.click(input)
    await expect(input).toHaveFocus()
    await userEvent.click(canvas.getByRole('button', { name: 'Copy project ID' }))
    await waitFor(() => expect(args.onCopy).toHaveBeenCalledWith('prj_7Hq2kLx9Vd3mN4'))
  },
}

export const FieldSizesAndFaces: StoryObj<typeof CopyField> = {
  parameters: { layout: 'padded' },
  argTypes: hideButtonControls,
  render: (args) => (
    <div className="flex max-w-md flex-col gap-3">
      <CopyField value="https://api.example.com/v2" what="API URL" aria-label="API URL (md)" onCopy={args.onCopy} />
      <CopyField
        value="https://api.example.com/v2"
        what="API URL"
        size="sm"
        aria-label="API URL (sm)"
        onCopy={args.onCopy}
      />
      <CopyField value="billing@northwind.example" mono={false} what="email" aria-label="Billing email" />
    </div>
  ),
}

/** Long values are truncated with an ellipsis; the full value is still copied. */
export const FieldLongValue: StoryObj<typeof CopyField> = {
  parameters: { layout: 'padded' },
  argTypes: hideButtonControls,
  render: (args) => (
    <div className="max-w-xs">
      <CopyField
        value="https://hooks.example.com/incoming/workspace-acme/channel-announcements/a8f3e21c9b7d4e6f"
        what="webhook URL"
        aria-label="Webhook URL"
        onCopy={args.onCopy}
      />
    </div>
  ),
}

/**
 * `SecretField`, driven by the controls: masked until revealed (the secret is not in the DOM
 * before that); Copy copies the real value without revealing it.
 */
export const Secret: StoryObj<typeof SecretField> = {
  parameters: { layout: 'padded' },
  args: {
    id: 'secret-key',
    value: 'sk_demo_4f9a2c7e1b8d3f6a',
    what: 'secret key',
    size: 'md',
    defaultRevealed: false,
    onRevealedChange: fn(),
  },
  argTypes: {
    ...hideButtonControls,
    size: { control: 'inline-radio', options: ['sm', 'md'] },
    mask: { control: 'text' },
    revealed: { control: false },
  },
  render: (args) => (
    <div className="flex max-w-md flex-col gap-1.5">
      <Label htmlFor={args.id}>Secret key</Label>
      <SecretField {...args} />
    </div>
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByLabelText('Secret key')
    await expect(input).not.toHaveValue('sk_demo_4f9a2c7e1b8d3f6a')
    await userEvent.click(canvas.getByRole('button', { name: 'Copy secret key' }))
    await waitFor(() => expect(clipboardSpy()).toHaveBeenCalledWith('sk_demo_4f9a2c7e1b8d3f6a'))
    await expect(input).not.toHaveValue('sk_demo_4f9a2c7e1b8d3f6a')

    await userEvent.click(canvas.getByRole('button', { name: 'Reveal secret key' }))
    await expect(input).toHaveValue('sk_demo_4f9a2c7e1b8d3f6a')
    await expect(args.onRevealedChange).toHaveBeenLastCalledWith(true)
    // The state is carried by the name alone (Reveal → Hide): no `aria-pressed` on top of it.
    const hide = canvas.getByRole('button', { name: 'Hide secret key' })
    await expect(hide).not.toHaveAttribute('aria-pressed')
    await userEvent.click(hide)
    await expect(input).not.toHaveValue('sk_demo_4f9a2c7e1b8d3f6a')
    await expect(args.onRevealedChange).toHaveBeenLastCalledWith(false)
  },
}

export const SecretRevealedAndMasked: StoryObj<typeof SecretField> = {
  parameters: { layout: 'padded' },
  argTypes: hideButtonControls,
  render: (args) => (
    <div className="flex max-w-md flex-col gap-3">
      <SecretField
        value="whsec_demo_9f8e7d6c5b4a"
        what="signing secret"
        aria-label="Signing secret (revealed)"
        defaultRevealed
        onCopy={args.onCopy}
      />
      <SecretField
        value="4F7K-9QXM-2B8R-TL6P"
        what="recovery code"
        mask="••••-••••-••••-TL6P"
        aria-label="Recovery code (custom mask)"
        onCopy={args.onCopy}
      />
      <SecretField value="hunter2-but-longer" what="password" size="sm" aria-label="Password (sm)" />
    </div>
  ),
}

/** Controlled `revealed`: one switch shows or hides every secret of the card at once. */
export const SecretControlled: StoryObj<typeof SecretField> = {
  parameters: { layout: 'padded' },
  argTypes: hideButtonControls,
  render: () => <RevealAllDemo />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const primary = canvas.getByLabelText('Primary key')
    const secondary = canvas.getByLabelText('Secondary key')
    await userEvent.click(canvas.getByRole('switch', { name: 'Show keys' }))
    await expect(primary).toHaveValue('sk_demo_primary_7c1e9b4a')
    await expect(secondary).toHaveValue('sk_demo_secondary_2d8f3a6c')
    // Hiding one field from its own button flows back through `onRevealedChange`.
    await userEvent.click(canvas.getByRole('button', { name: 'Hide primary key' }))
    await expect(canvas.getByRole('switch', { name: 'Show keys' })).toHaveAttribute('aria-checked', 'false')
    await expect(secondary).not.toHaveValue('sk_demo_secondary_2d8f3a6c')
  },
}

function RevealAllDemo() {
  const [shown, setShown] = React.useState(false)
  return (
    <div className="flex max-w-md flex-col gap-3">
      <div className="flex items-center gap-2">
        <Switch id="show-keys" checked={shown} onCheckedChange={setShown} />
        <Label htmlFor="show-keys">Show keys</Label>
      </div>
      <SecretField
        value="sk_demo_primary_7c1e9b4a"
        what="primary key"
        aria-label="Primary key"
        revealed={shown}
        onRevealedChange={setShown}
      />
      <SecretField
        value="sk_demo_secondary_2d8f3a6c"
        what="secondary key"
        aria-label="Secondary key"
        revealed={shown}
        onRevealedChange={setShown}
      />
    </div>
  )
}

/** French texts for the `labels` of the three components (see {@link CopyLabels}). */
const frenchLabels: CopyLabels = {
  copy: 'Copier',
  copied: 'Copié',
  copyWhat: (what) => `Copier ${what}`,
  reveal: 'Afficher',
  hide: 'Masquer',
  revealWhat: (what) => `Afficher ${what ?? 'la valeur'}`,
  hideWhat: (what) => `Masquer ${what ?? 'la valeur'}`,
}

/**
 * `labels` translates every built-in text: the "Copy" / "Copied" button, the icon-only name and
 * tooltip, the Reveal / Hide toggle and the announcement. Define the object once (module level)
 * and pass it to each `CopyButton`, `CopyField` and `SecretField`; entries you leave out keep
 * their English default.
 */
export const Translated: Story = {
  parameters: { layout: 'padded' },
  args: { value: 'FAC-2026-0142', what: 'le numéro de facture', labels: frenchLabels },
  render: (args) => (
    <div className="flex max-w-md flex-col gap-3">
      <div className="flex items-center gap-2 text-sm text-foreground">
        <span className="font-mono text-[13px]">{args.value}</span>
        <CopyButton {...args} variant="ghost" />
      </div>
      <CopyField
        value="prj_7Hq2kLx9Vd3mN4"
        what="l’identifiant du projet"
        aria-label="Identifiant du projet"
        labels={args.labels}
        onCopy={args.onCopy}
      />
      <SecretField
        value="sk_demo_4f9a2c7e1b8d3f6a"
        what="la clé secrète"
        aria-label="Clé secrète"
        labels={args.labels}
        onCopy={args.onCopy}
      />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('button', { name: 'Copier le numéro de facture' })).toBeInTheDocument()
    await userEvent.click(canvas.getByRole('button', { name: 'Afficher la clé secrète' }))
    await expect(canvas.getByRole('button', { name: 'Masquer la clé secrète' })).toBeInTheDocument()
    await userEvent.click(canvas.getByRole('button', { name: 'Copier l’identifiant du projet' }))
    await expect(await canvas.findByRole('button', { name: 'Copié' })).toBeInTheDocument()
    await waitFor(() =>
      expect(canvas.getAllByRole('status').filter((status) => status.textContent === 'Copié')).toHaveLength(1),
    )
  },
}

/** Composition: an "API access" card mixing copy fields, a secret and a code snippet. */
export const ApiAccessCard: Story = {
  parameters: { layout: 'padded' },
  render: (args) => (
    <Card className="max-w-xl">
      <CardHeader>
        <CardTitle>API access</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="api-base">Base URL</Label>
          <CopyField id="api-base" value="https://api.example.com/v2" what="base URL" onCopy={args.onCopy} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="api-publishable">Publishable key</Label>
          <CopyField
            id="api-publishable"
            value="pk_demo_7c1e9b4a2d"
            what="publishable key"
            onCopy={args.onCopy}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="api-secret">Secret key</Label>
          <SecretField id="api-secret" value="sk_demo_4f9a2c7e1b8d3f6a" what="secret key" onCopy={args.onCopy} />
        </div>
        <CodeBlock code="export ACME_API_KEY=sk_demo_…" prompt onCopy={args.onCopy} />
      </CardContent>
    </Card>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    // Each labelled Copy button has a distinct accessible name.
    await expect(canvas.getByRole('button', { name: 'Copy base URL' })).toBeInTheDocument()
    await expect(canvas.getByRole('button', { name: 'Copy publishable key' })).toBeInTheDocument()
    await expect(canvas.getByRole('button', { name: 'Copy secret key' })).toBeInTheDocument()
  },
}
