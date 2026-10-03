import type { Meta, StoryObj } from '@storybook/react-vite'
import { CircleCheck, Info, OctagonX, TriangleAlert } from 'lucide-react'
import { expect, within } from 'storybook/test'

import { cn } from '../lib/utils'

import { Code, DocSection, TokenValue, useCssVariables, withInlineCode } from './doc-blocks'

/** How a swatch previews its token: a filled chip, a text sample or a 1px line. */
type SwatchKind = 'fill' | 'text' | 'line'

interface ColorToken {
  /** Tailwind color name (usable with any prefix: bg-, text-, border-, ring-, fill-, stroke-, divide-…). */
  name: string
  /** CSS custom property defined in tokens.css. */
  variable: string
  /** The utility this token is most often used with. */
  utility: string
  /** Literal classes painting the preview (literal so Tailwind generates them). */
  swatch: string
  kind: SwatchKind
  /** What the token is for. */
  usage: string
  /** Token this one points to (`var(--…)` in tokens.css). */
  alias?: string
}

interface ColorGroup {
  id: ColorGroupId
  title: string
  description: string
  tokens: ColorToken[]
}

type ColorGroupId = 'surfaces' | 'text' | 'borders' | 'primary' | 'feedback' | 'charts' | 'aliases'

const groups: ColorGroup[] = [
  {
    id: 'surfaces',
    title: 'Canvas & surfaces',
    description:
      'Near-white canvas in light mode, green-tinted charcoal in dark mode. Panels sit one step above the canvas; hover and selected rows use translucent fills so they work on any surface.',
    tokens: [
      { name: 'background', variable: '--background', utility: 'bg-background', swatch: 'bg-background', kind: 'fill', usage: 'Page canvas behind everything.' },
      { name: 'surface-75', variable: '--surface-75', utility: 'bg-surface-75', swatch: 'bg-surface-75', kind: 'fill', usage: 'Recessed strips: form-card footers, save bars, hovered cards; the light-mode `code` surface.' },
      { name: 'surface-100', variable: '--surface-100', utility: 'bg-surface-100', swatch: 'bg-surface-100', kind: 'fill', usage: 'Cards, panels, inputs and default buttons.' },
      { name: 'surface-200', variable: '--surface-200', utility: 'bg-surface-200', swatch: 'bg-surface-200', kind: 'fill', usage: 'Translucent fill: hover and pressed states, table headers, menu highlights, muted chips, kbd caps.' },
      { name: 'surface-300', variable: '--surface-300', utility: 'bg-surface-300', swatch: 'bg-surface-300', kind: 'fill', usage: 'Raised overlays (through `popover`): menus, dialogs, tooltips; active toggles in dark mode.' },
      { name: 'selection', variable: '--selection', utility: 'bg-selection', swatch: 'bg-selection', kind: 'fill', usage: 'Selected table rows and the active navigation item.' },
      { name: 'overlay', variable: '--overlay', utility: 'bg-overlay', swatch: 'bg-overlay', kind: 'fill', usage: 'Scrim behind modal dialogs and sheets.' },
      { name: 'code', variable: '--code-bg', utility: 'bg-code', swatch: 'bg-code', kind: 'fill', usage: 'Sunken surface for code samples you style yourself (`CodeBlock` uses `surface-200`).' },
    ],
  },
  {
    id: 'text',
    title: 'Text',
    description:
      'Four steps of ink. Hierarchy comes from these steps and from size, not from bold weights.',
    tokens: [
      { name: 'foreground', variable: '--foreground', utility: 'text-foreground', swatch: 'bg-background text-foreground', kind: 'text', usage: 'Primary text: titles, values, body copy.' },
      { name: 'foreground-light', variable: '--foreground-light', utility: 'text-foreground-light', swatch: 'bg-background text-foreground-light', kind: 'text', usage: 'Secondary text: descriptions, inactive nav items.' },
      { name: 'foreground-lighter', variable: '--foreground-lighter', utility: 'text-foreground-lighter', swatch: 'bg-background text-foreground-lighter', kind: 'text', usage: 'Captions, mono labels, table headers, icons.' },
      { name: 'foreground-muted', variable: '--foreground-muted', utility: 'text-foreground-muted', swatch: 'bg-background text-foreground-muted', kind: 'text', usage: 'Decorative marks only (separators, prompt characters, idle icons): too faint for text that must be read.' },
    ],
  },
  {
    id: 'borders',
    title: 'Borders',
    description:
      'Hairline 1px borders in three strengths. Every element defaults to `border`, so a bare `border` class draws the quietest line.',
    tokens: [
      { name: 'border', variable: '--border', utility: 'border (default)', swatch: 'border-border', kind: 'line', usage: 'Cards, dividers, table rows, section separators.' },
      { name: 'border-strong', variable: '--border-strong', utility: 'border-border-strong', swatch: 'border-border-strong', kind: 'line', usage: 'Controls (inputs, buttons, selects) and overlay outlines.' },
      { name: 'border-stronger', variable: '--border-stronger', utility: 'border-border-stronger', swatch: 'border-border-stronger', kind: 'line', usage: 'Hover state of controls, dashed buttons, scrollbar thumbs.' },
    ],
  },
  {
    id: 'primary',
    title: 'Primary & brand',
    description:
      'One blue for interaction: the main button, links, focus rings and selection. `primary` is the ink (lighter in dark mode for contrast); `primary-solid` is the fill that keeps white text readable in both themes. `brand` is an accent for logos and the first chart series — override it per product.',
    tokens: [
      { name: 'primary', variable: '--primary', utility: 'text-primary', swatch: 'bg-primary', kind: 'fill', usage: 'Links, active icons, selected text.' },
      { name: 'primary-solid', variable: '--primary-solid', utility: 'bg-primary-solid', swatch: 'bg-primary-solid', kind: 'fill', usage: 'Primary button, checked checkbox / switch fill.' },
      { name: 'primary-solid-border', variable: '--primary-solid-border', utility: 'border-primary-solid-border', swatch: 'border-primary-solid-border', kind: 'line', usage: 'Border of solid primary fills.' },
      { name: 'primary-bright', variable: '--primary-bright', utility: 'border-primary-bright', swatch: 'bg-primary-bright', kind: 'fill', usage: 'Focused input border, highlights.' },
      { name: 'primary-soft', variable: '--primary-soft', utility: 'bg-primary-soft', swatch: 'bg-primary-soft', kind: 'fill', usage: 'Tinted backgrounds: counters, text selection.' },
      { name: 'primary-foreground', variable: '--primary-foreground', utility: 'text-primary-foreground', swatch: 'bg-primary-solid text-primary-foreground', kind: 'text', usage: 'Text and icons on primary-solid.' },
      { name: 'brand', variable: '--brand', utility: 'bg-brand', swatch: 'bg-brand', kind: 'fill', usage: 'Logo marks, first chart series. Product-specific.' },
    ],
  },
  {
    id: 'feedback',
    title: 'Feedback',
    description:
      'Status colors come in sets: an ink for text and icons, a `-soft` fill and a `-border` for tinted containers (badges, callouts, danger zones). Success has no border token: use `border-success/30`. Use them only to communicate status, never for decoration.',
    tokens: [
      { name: 'success', variable: '--success', utility: 'text-success', swatch: 'bg-success', kind: 'fill', usage: 'Healthy, completed, paid, online.' },
      { name: 'success-soft', variable: '--success-soft', utility: 'bg-success-soft', swatch: 'bg-success-soft', kind: 'fill', usage: 'Success badge / callout fill.' },
      { name: 'warning', variable: '--warning', utility: 'text-warning', swatch: 'bg-warning', kind: 'fill', usage: 'Degraded, pending attention, expiring soon.' },
      { name: 'warning-soft', variable: '--warning-soft', utility: 'bg-warning-soft', swatch: 'bg-warning-soft', kind: 'fill', usage: 'Warning badge / callout fill.' },
      { name: 'warning-border', variable: '--warning-border', utility: 'border-warning-border', swatch: 'border-warning-border', kind: 'line', usage: 'Warning badge / callout border.' },
      { name: 'destructive', variable: '--destructive', utility: 'text-destructive', swatch: 'bg-destructive', kind: 'fill', usage: 'Errors, failed states, destructive ink.' },
      { name: 'destructive-solid', variable: '--destructive-solid', utility: 'bg-destructive-solid', swatch: 'bg-destructive-solid', kind: 'fill', usage: 'Confirm button of destructive dialogs only.' },
      { name: 'destructive-soft', variable: '--destructive-soft', utility: 'bg-destructive-soft', swatch: 'bg-destructive-soft', kind: 'fill', usage: 'Error callout and danger-zone fill.' },
      { name: 'destructive-border', variable: '--destructive-border', utility: 'border-destructive-border', swatch: 'border-destructive-border', kind: 'line', usage: 'Error callout, destructive button and invalid field border.' },
      { name: 'info', variable: '--info', utility: 'text-info', swatch: 'bg-info', kind: 'fill', usage: 'Neutral information, tips, in-progress.' },
      { name: 'info-soft', variable: '--info-soft', utility: 'bg-info-soft', swatch: 'bg-info-soft', kind: 'fill', usage: 'Info badge / callout fill.' },
      { name: 'info-border', variable: '--info-border', utility: 'border-info-border', swatch: 'border-info-border', kind: 'line', usage: 'Info badge / callout border.' },
    ],
  },
  {
    id: 'charts',
    title: 'Charts',
    description:
      'Five categorical series colors, in this order. `chart-1` follows `brand`. Keep one meaning per color across a dashboard.',
    tokens: [
      { name: 'chart-1', variable: '--chart-1', utility: 'fill-chart-1', swatch: 'bg-chart-1', kind: 'fill', usage: 'First series.', alias: '--brand' },
      { name: 'chart-2', variable: '--chart-2', utility: 'fill-chart-2', swatch: 'bg-chart-2', kind: 'fill', usage: 'Second series.' },
      { name: 'chart-3', variable: '--chart-3', utility: 'fill-chart-3', swatch: 'bg-chart-3', kind: 'fill', usage: 'Third series.' },
      { name: 'chart-4', variable: '--chart-4', utility: 'fill-chart-4', swatch: 'bg-chart-4', kind: 'fill', usage: 'Fourth series.' },
      { name: 'chart-5', variable: '--chart-5', utility: 'fill-chart-5', swatch: 'bg-chart-5', kind: 'fill', usage: 'Fifth series.' },
    ],
  },
  {
    id: 'aliases',
    title: 'shadcn aliases',
    description:
      'The standard shadcn/ui names, mapped onto the tokens above so third-party shadcn components look native. Prefer the ferry-ui names in new code; override the source token, not the alias.',
    tokens: [
      { name: 'card', variable: '--card', utility: 'bg-card', swatch: 'bg-card', kind: 'fill', usage: 'Card surface.', alias: '--surface-100' },
      { name: 'card-foreground', variable: '--card-foreground', utility: 'text-card-foreground', swatch: 'bg-card text-card-foreground', kind: 'text', usage: 'Text on cards.', alias: '--foreground' },
      { name: 'popover', variable: '--popover', utility: 'bg-popover', swatch: 'bg-popover', kind: 'fill', usage: 'Popover, menu and dialog surface.', alias: '--surface-300' },
      { name: 'popover-foreground', variable: '--popover-foreground', utility: 'text-popover-foreground', swatch: 'bg-popover text-popover-foreground', kind: 'text', usage: 'Text on overlays.', alias: '--foreground' },
      { name: 'secondary', variable: '--secondary', utility: 'bg-secondary', swatch: 'bg-secondary', kind: 'fill', usage: 'Secondary fills.', alias: '--surface-200' },
      { name: 'secondary-foreground', variable: '--secondary-foreground', utility: 'text-secondary-foreground', swatch: 'bg-secondary text-secondary-foreground', kind: 'text', usage: 'Text on secondary fills.', alias: '--foreground' },
      { name: 'muted', variable: '--muted', utility: 'bg-muted', swatch: 'bg-muted', kind: 'fill', usage: 'Muted fills (skeletons, tracks).', alias: '--surface-200' },
      { name: 'muted-foreground', variable: '--muted-foreground', utility: 'text-muted-foreground', swatch: 'bg-background text-muted-foreground', kind: 'text', usage: 'Muted text.', alias: '--foreground-lighter' },
      { name: 'accent', variable: '--accent', utility: 'bg-accent', swatch: 'bg-accent', kind: 'fill', usage: 'shadcn hover / highlight fill. ferry-ui menus highlight with `surface-200` instead.', alias: '--selection' },
      { name: 'accent-foreground', variable: '--accent-foreground', utility: 'text-accent-foreground', swatch: 'bg-accent text-accent-foreground', kind: 'text', usage: 'Text on accent.', alias: '--foreground' },
      { name: 'input', variable: '--input', utility: 'border-input', swatch: 'border-input', kind: 'line', usage: 'Form control borders.', alias: '--border-strong' },
      { name: 'ring', variable: '--ring', utility: 'ring-ring', swatch: 'bg-ring', kind: 'fill', usage: 'Focus rings (focus-visible:ring-2 ring-ring).' },
    ],
  },
]

const allVariables = groups.flatMap((group) => group.tokens.map((token) => token.variable))
const tokenCount = allVariables.length

function Swatch({ token }: { token: ColorToken }) {
  if (token.kind === 'line') {
    return (
      <div className="relative h-14 border-b bg-surface-100">
        <div className={cn('absolute inset-2.5 rounded-md border', token.swatch)} />
      </div>
    )
  }
  return (
    <div className={cn('flex h-14 items-center border-b px-3', token.swatch)}>
      {token.kind === 'text' && <span className="text-xl font-medium">Aa</span>}
    </div>
  )
}

function TokenCard({ token, value, showValue }: { token: ColorToken; value: string; showValue: boolean }) {
  return (
    <div data-testid="color-token" className="flex min-w-0 flex-col overflow-hidden rounded-lg border bg-card shadow-card">
      <Swatch token={token} />
      <div className="flex min-w-0 flex-col gap-1.5 px-3 py-2.5">
        <div className="text-[13px] font-medium text-foreground">{token.name}</div>
        <div className="flex flex-wrap gap-1">
          <Code>{token.utility}</Code>
          <Code>{token.variable}</Code>
        </div>
        {showValue && (
          <div className="flex flex-col">
            {token.alias && <span className="font-mono text-[11.5px] text-foreground-lighter">→ var({token.alias})</span>}
            <TokenValue value={value} />
          </div>
        )}
        <p className="text-xs text-foreground-light">{withInlineCode(token.usage)}</p>
      </div>
    </div>
  )
}

/** Props of the color token gallery. */
interface ColorTokensProps {
  /** Token group to show, or `all`. */
  group?: ColorGroupId | 'all'
  /** Show the computed value of each CSS variable (read live from the page, follows the theme). */
  showValues?: boolean
}

/**
 * Gallery of ferry-ui color tokens: preview, Tailwind utility, CSS variable, computed value and usage.
 * Values are read with getComputedStyle, so they follow the light / dark toolbar toggle.
 */
function ColorTokens({ group = 'all', showValues = true }: ColorTokensProps) {
  const values = useCssVariables(allVariables)
  const shown = group === 'all' ? groups : groups.filter((g) => g.id === group)
  return (
    <div className="flex flex-col gap-10">
      {shown.map((g) => (
        <DocSection key={g.id} title={g.title} description={g.description}>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(210px,1fr))] gap-3">
            {g.tokens.map((token) => (
              <TokenCard key={token.variable} token={token} value={values[token.variable] ?? ''} showValue={showValues} />
            ))}
          </div>
        </DocSection>
      ))}
    </div>
  )
}

const meta = {
  title: 'Foundations/Colors',
  component: ColorTokens,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Every color is a CSS variable from `tokens.css` (light on `:root`, dark on `.dark`) exposed as a Tailwind color, so `bg-surface-100`, `text-foreground-light` or `border-border-strong` switch theme automatically. Use tokens only — never raw hex/rgb in components. Toggle the toolbar theme to see the dark values.',
      },
    },
  },
  args: {
    group: 'all',
    showValues: true,
  },
  // The demo component lives in this stories file, which docgen skips: describe its props here.
  argTypes: {
    group: {
      description: 'Token group to show, or `all`.',
      control: 'select',
      options: ['all', 'surfaces', 'text', 'borders', 'primary', 'feedback', 'charts', 'aliases'],
      table: { defaultValue: { summary: 'all' } },
    },
    showValues: {
      description: 'Show the computed value of each CSS variable (read live from the page, follows the theme).',
      control: 'boolean',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'true' } },
    },
  },
} satisfies Meta<typeof ColorTokens>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getAllByTestId('color-token')).toHaveLength(tokenCount)
    await expect(canvas.getByText('--primary-solid')).toBeInTheDocument()
    await expect(canvas.getByRole('heading', { name: 'Canvas & surfaces' })).toBeInTheDocument()
  },
}

export const CanvasAndSurfaces: Story = { args: { group: 'surfaces' } }

export const TextColors: Story = { args: { group: 'text' } }

export const Borders: Story = { args: { group: 'borders' } }

export const PrimaryAndBrand: Story = { args: { group: 'primary' } }

export const Feedback: Story = { args: { group: 'feedback' } }

export const Charts: Story = { args: { group: 'charts' } }

export const ShadcnAliases: Story = { args: { group: 'aliases' } }

/** Swatches without computed values: a compact reference for picking a class name. */
export const WithoutValues: Story = { args: { showValues: false, group: 'surfaces' } }

/**
 * How surfaces stack, with the exact fills the components use: canvas (`background`, also behind the
 * navigation, whose active item is `selection`) → card (`surface-100` + `border` + `shadow-card`) with
 * a `surface-200` table header, a hovered row (`surface-200`), a selected row (`selection`) and a
 * recessed `surface-75` footer → floating menu (`popover` + `border-strong` + `shadow-overlay`)
 * whose highlighted item is `surface-200`.
 */
export const SurfaceStack: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <div className="flex min-h-[340px] w-full max-w-3xl overflow-hidden rounded-lg border bg-background">
      <nav aria-label="Workspace" className="hidden w-44 shrink-0 flex-col gap-0.5 border-r p-2 sm:flex">
        <span className="px-3 pt-1 pb-2 mono-label">Workspace</span>
        <span className="flex h-[30px] items-center rounded-md bg-selection px-3 text-sm font-medium text-foreground">
          Projects
        </span>
        <span className="flex h-[30px] items-center rounded-md px-3 text-sm text-foreground-light">Team members</span>
        <span className="flex h-[30px] items-center rounded-md px-3 text-sm text-foreground-light">Invoices</span>
      </nav>
      <div className="relative min-w-0 flex-1 p-6">
        <div className="overflow-hidden rounded-lg border bg-card shadow-card">
          <div className="flex h-9 items-center border-b bg-surface-200 px-4 mono-label">Project</div>
          <div className="border-b px-4 py-2.5 text-[13px] text-foreground">Marketing site</div>
          <div className="border-b bg-surface-200 px-4 py-2.5 text-[13px] text-foreground">Billing portal (hover)</div>
          <div className="bg-selection px-4 py-2.5 text-[13px] text-foreground">Mobile app (selected)</div>
          <div className="flex justify-end border-t bg-surface-75 px-4 py-2.5 text-xs text-foreground-lighter">
            3 projects
          </div>
        </div>
        <div className="absolute top-20 right-10 w-48 rounded-lg border border-border-strong bg-popover p-1 text-popover-foreground shadow-overlay">
          <div className="rounded-[5px] bg-surface-200 px-2 py-1.5 text-[13px] text-foreground">Open project</div>
          <div className="rounded-[5px] px-2 py-1.5 text-[13px] text-foreground-light">Duplicate</div>
          <div className="rounded-[5px] px-2 py-1.5 text-[13px] text-destructive">Archive</div>
        </div>
      </div>
    </div>
  ),
}

const feedbackRows = [
  {
    icon: CircleCheck,
    box: 'border-success/30 bg-success-soft',
    ink: 'text-success',
    title: 'Invoice #1042 paid',
    body: 'The payment of $1,280.00 was received on March 3.',
  },
  {
    icon: TriangleAlert,
    box: 'border-warning-border bg-warning-soft',
    ink: 'text-warning',
    title: 'Card expires in 7 days',
    body: 'Update the payment method to avoid failed renewals.',
  },
  {
    icon: OctagonX,
    box: 'border-destructive-border bg-destructive-soft',
    ink: 'text-destructive',
    title: 'API key revoked',
    body: 'Requests signed with this key are now rejected.',
  },
  {
    icon: Info,
    box: 'border-info-border bg-info-soft',
    ink: 'text-info',
    title: 'Usage report is being generated',
    body: 'You will get an email when the export is ready.',
  },
]

/**
 * Feedback sets in context: `-soft` fill + `-border` + ink for the icon and title, body text stays
 * neutral. The `Callout` pattern and the `Badge` tones implement exactly these pairings: use them rather
 * than hand-building tinted boxes.
 */
export const FeedbackPairings: Story = {
  render: () => (
    <div className="flex w-full max-w-xl flex-col gap-3">
      {feedbackRows.map(({ icon: Icon, box, ink, title, body }) => (
        <div key={title} className={cn('flex gap-3 rounded-lg border px-4 py-3', box)}>
          <Icon className={cn('mt-0.5 size-4 shrink-0', ink)} />
          <div className="flex flex-col gap-0.5">
            <span className={cn('text-[13px] font-medium', ink)}>{title}</span>
            <span className="text-[13px] text-foreground-light">{body}</span>
          </div>
        </div>
      ))}
    </div>
  ),
}

const plans = [
  { name: 'Free', bar: 'bg-chart-1', value: 38 },
  { name: 'Starter', bar: 'bg-chart-2', value: 64 },
  { name: 'Pro', bar: 'bg-chart-3', value: 92 },
  { name: 'Team', bar: 'bg-chart-4', value: 57 },
  { name: 'Enterprise', bar: 'bg-chart-5', value: 24 },
]

/** The chart series in order, on a card: signups per plan this month. */
export const ChartSeries: Story = {
  render: () => (
    <div className="w-full max-w-md overflow-hidden rounded-lg border bg-card shadow-card">
      <div className="border-b px-4 py-2.5 mono-label">Signups by plan</div>
      <div className="flex flex-col gap-2.5 px-4 py-4">
        {plans.map((plan) => (
          <div key={plan.name} className="grid grid-cols-[80px_1fr_32px] items-center gap-3 text-[13px]">
            <span className="text-foreground-light">{plan.name}</span>
            <div className="h-2 overflow-hidden rounded-full bg-surface-200">
              <div className={cn('h-full rounded-full', plan.bar)} style={{ width: `${plan.value}%` }} />
            </div>
            <span className="text-right text-foreground tabular">{plan.value}</span>
          </div>
        ))}
      </div>
    </div>
  ),
}
