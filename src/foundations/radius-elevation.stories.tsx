import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'

import { cn } from '../lib/utils'

import { Code, DocSection, TokenValue, useCssVariables, withInlineCode } from './doc-blocks'

const radii = {
  sm: {
    className: 'rounded-sm',
    variable: '--ferry-ui-radius-sm',
    literal: '',
    usage: 'Square badges, keyboard caps, checkboxes, inline code chips.',
  },
  nested: {
    className: 'rounded-[5px]',
    variable: '',
    literal: '5px',
    usage:
      'Rows nested in a padded overlay: menu, select and command items, pill tabs. One step under the 8px container so corners stay concentric.',
  },
  md: {
    className: 'rounded-md',
    variable: '--ferry-ui-radius-md',
    literal: '',
    usage: 'Controls: buttons, inputs, select triggers, toggles, tooltips, navigation items.',
  },
  lg: {
    className: 'rounded-lg',
    variable: '--ferry-ui-radius-lg',
    literal: '',
    usage: 'Containers: cards, tables, popovers, menus, dialogs, toasts, callouts.',
  },
  xl: {
    className: 'rounded-xl',
    variable: '--ferry-ui-radius-xl',
    literal: '',
    usage: 'Reserved for large standalone surfaces (sign-in panel, onboarding frame). No built-in component uses it.',
  },
  full: {
    className: 'rounded-full',
    variable: '',
    literal: 'calc(infinity * 1px)',
    usage: 'Pill badges, avatars, status dots, switches, pill buttons.',
  },
} as const

const shadows = {
  none: { className: 'shadow-none', variable: '', usage: 'Flat content: rows, list items, inline panels.' },
  card: {
    className: 'shadow-card',
    variable: '--shadow-card',
    usage: 'Cards and tables. A barely-there 1px lift in light mode; none in dark mode.',
  },
  overlay: {
    className: 'shadow-overlay',
    variable: '--shadow-overlay',
    usage: 'Everything that floats: popovers, menus, selects, dialogs, sheets, toasts.',
  },
} as const

const borders = {
  border: {
    className: 'border-border',
    variable: '--border',
    usage: 'Default hairline: cards, dividers, table rows. A bare `border` class uses it.',
  },
  strong: {
    className: 'border-border-strong',
    variable: '--border-strong',
    usage: 'Interactive controls (inputs, buttons, selects) and overlay outlines.',
  },
  stronger: {
    className: 'border-border-stronger',
    variable: '--border-stronger',
    usage: 'Hover state of controls, dashed filter buttons.',
  },
} as const

type RadiusName = keyof typeof radii
type ShadowName = keyof typeof shadows
type BorderName = keyof typeof borders

const variables = [
  ...Object.values(radii).map((r) => r.variable),
  ...Object.values(shadows).map((s) => s.variable),
  ...Object.values(borders).map((b) => b.variable),
].filter(Boolean)

/** Props of the surface playground. */
interface SurfaceSampleProps {
  /** Corner radius token. */
  radius?: RadiusName
  /** Elevation token. */
  elevation?: ShadowName
  /** Border strength. */
  border?: BorderName
  /** Surface color. */
  surface?: 'surface-100' | 'popover' | 'surface-75'
}

const surfaces = { 'surface-100': 'bg-surface-100', popover: 'bg-popover', 'surface-75': 'bg-surface-75' } as const

/** A sample surface combining one radius, one elevation and one border strength, with the resulting classes. */
function SurfaceSample({ radius = 'lg', elevation = 'card', border = 'border', surface = 'surface-100' }: SurfaceSampleProps) {
  const classes = cn('border', radii[radius].className, shadows[elevation].className, borders[border].className, surfaces[surface])
  return (
    <div className="flex flex-col items-center gap-4 p-6">
      <div data-testid="surface-sample" className={cn('flex h-32 w-56 flex-col justify-between p-4', classes)}>
        <span className="mono-label">Storage</span>
        <span className="text-xl text-foreground tabular">42.8 GB</span>
      </div>
      <Code>{classes}</Code>
    </div>
  )
}

const meta = {
  title: 'Foundations/Radius & Elevation',
  component: SurfaceSample,
  parameters: {
    docs: {
      description: {
        component:
          'Shape and depth are quiet: 6px controls, 8px containers, 1px hairline borders, and shadows only where something floats. In dark mode the card shadow disappears and depth comes from surface lightness and borders. Pick the radius by role (control vs container), never by size.',
      },
    },
  },
  args: {
    radius: 'lg',
    elevation: 'card',
    border: 'border',
    surface: 'surface-100',
  },
  // The demo component lives in this stories file, which docgen skips: describe its props here.
  argTypes: {
    radius: {
      description: 'Radius token of the sample (`rounded-*`).',
      control: 'inline-radio',
      options: Object.keys(radii),
      table: { defaultValue: { summary: 'lg' } },
    },
    elevation: {
      description: 'Elevation token (`shadow-*`): `card` for resting surfaces, `overlay` for floating ones.',
      control: 'inline-radio',
      options: Object.keys(shadows),
      table: { defaultValue: { summary: 'card' } },
    },
    border: {
      description: 'Border strength.',
      control: 'inline-radio',
      options: Object.keys(borders),
      table: { defaultValue: { summary: 'border' } },
    },
    surface: {
      description: 'Surface color under the sample.',
      control: 'inline-radio',
      options: Object.keys(surfaces),
      table: { defaultValue: { summary: 'surface-100' } },
    },
  },
} satisfies Meta<typeof SurfaceSample>

export default meta
type Story = StoryObj<typeof meta>

/** Combine the tokens with the controls; the resulting classes are printed below the sample. */
export const Default: Story = {
  play: async ({ canvasElement }) => {
    const sample = within(canvasElement).getByTestId('surface-sample')
    await expect(sample).toHaveClass('rounded-lg', 'shadow-card', 'border')
  },
}

/** A floating surface: popover color, strong border, overlay shadow. */
export const Floating: Story = {
  args: { elevation: 'overlay', border: 'strong', surface: 'popover' },
}

function RadiiDemo() {
  const values = useCssVariables(variables)
  return (
    <DocSection
      title="Radii"
      description="Four token steps, a 5px step for rows nested in overlays, and full. Controls are 6px, containers 8px."
    >
      <div className="grid w-full max-w-4xl grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-3">
        {Object.entries(radii).map(([name, radius]) => (
          <div key={name} className="flex flex-col gap-2.5 rounded-lg border bg-card p-4 shadow-card">
            <div
              data-testid="radius-swatch"
              className={cn('h-16 w-full border border-border-strong bg-surface-200', radius.className)}
            />
            <div className="flex items-center justify-between gap-2">
              <span className="text-[13px] font-medium text-foreground">{name}</span>
              <TokenValue value={radius.variable ? values[radius.variable] : radius.literal} />
            </div>
            <div className="flex flex-wrap gap-1">
              <Code>{radius.className}</Code>
              {radius.variable && <Code>{radius.variable}</Code>}
            </div>
            <p className="text-xs text-foreground-light">{radius.usage}</p>
          </div>
        ))}
      </div>
    </DocSection>
  )
}

/** The radius scale and where each step is used. */
export const Radii: Story = {
  parameters: { layout: 'padded' },
  render: () => <RadiiDemo />,
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getAllByTestId('radius-swatch')).toHaveLength(Object.keys(radii).length)
  },
}

function ShadowsDemo() {
  const values = useCssVariables(variables)
  return (
    <DocSection
      title="Shadows"
      description="Two elevations. Toggle dark mode: the card shadow turns off, the overlay shadow gets deeper."
    >
      <div className="grid w-full max-w-4xl gap-4 bg-background p-2 sm:grid-cols-3">
        {Object.entries(shadows).map(([name, shadow]) => (
          <div key={name} className="flex flex-col gap-3">
            <div className={cn('flex h-24 items-center justify-center rounded-lg border bg-card', shadow.className)}>
              <span className="mono-label">{name}</span>
            </div>
            <div className="flex flex-wrap gap-1">
              <Code>{shadow.className}</Code>
              {shadow.variable && <Code>{shadow.variable}</Code>}
            </div>
            {shadow.variable && <TokenValue value={values[shadow.variable]} />}
            <p className="text-xs text-foreground-light">{shadow.usage}</p>
          </div>
        ))}
      </div>
    </DocSection>
  )
}

/** `shadow-card` for resting containers, `shadow-overlay` for anything that floats above the page. */
export const Shadows: Story = {
  parameters: { layout: 'padded' },
  render: () => <ShadowsDemo />,
}

function BordersDemo() {
  const values = useCssVariables(variables)
  return (
    <DocSection
      title="Borders"
      description="Always 1px. Strength encodes role: containers use the default hairline, controls the strong one, hover the stronger one."
    >
      <div className="grid w-full max-w-4xl gap-3 sm:grid-cols-3">
        {Object.entries(borders).map(([name, border]) => (
          <div key={name} className="flex flex-col gap-3">
            <div className={cn('flex h-20 items-center justify-center rounded-lg border bg-card', border.className)}>
              <span className="mono-label">{name}</span>
            </div>
            <div className="flex flex-wrap gap-1">
              <Code>{border.className}</Code>
              <Code>{border.variable}</Code>
            </div>
            <TokenValue value={values[border.variable]} />
            <p className="text-xs text-foreground-light">{withInlineCode(border.usage)}</p>
          </div>
        ))}
      </div>
    </DocSection>
  )
}

/** The three border strengths. */
export const Borders: Story = {
  parameters: { layout: 'padded' },
  render: () => <BordersDemo />,
}

/**
 * The elevation ladder in one picture: canvas → card (`rounded-lg border shadow-card`) → control
 * (`rounded-md border-border-strong`) → floating menu
 * (`rounded-lg border-border-strong bg-popover shadow-overlay p-1`) whose items use the nested
 * `rounded-[5px]`.
 */
export const ElevationLadder: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <div className="relative w-full max-w-2xl rounded-lg border bg-background p-6 bg-dot-grid">
      <div className="flex flex-col overflow-hidden rounded-lg border bg-card shadow-card">
        <div className="flex items-center justify-between border-b px-5 py-3">
          <span className="text-sm font-medium text-foreground">Team members</span>
          <span className="inline-flex h-[30px] items-center rounded-md border border-border-strong bg-surface-100 px-2.5 text-[13px] font-medium text-foreground">
            Invite
          </span>
        </div>
        {['Maya Chen · Owner', 'Liam Novak · Admin', 'Sara Ortiz · Member'].map((row) => (
          <div key={row} className="border-b px-5 py-2.5 text-[13px] text-foreground last:border-b-0">
            {row}
          </div>
        ))}
      </div>
      <div className="absolute top-16 right-10 w-44 rounded-lg border border-border-strong bg-popover p-1 text-popover-foreground shadow-overlay">
        <div className="rounded-[5px] bg-surface-200 px-2 py-1.5 text-[13px] text-foreground">Change role</div>
        <div className="rounded-[5px] px-2 py-1.5 text-[13px] text-foreground-light">Resend invite</div>
        <div className="rounded-[5px] px-2 py-1.5 text-[13px] text-destructive">Remove</div>
      </div>
    </div>
  ),
}
