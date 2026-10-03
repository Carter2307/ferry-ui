import * as React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Monitor, Moon, Sun } from 'lucide-react'
import { expect, fn, userEvent, within } from 'storybook/test'

import { Badge } from '../components/primitives/badge'
import { Button } from '../components/primitives/button'
import { Checkbox } from '../components/primitives/checkbox'
import { Input } from '../components/primitives/input'
import { Label } from '../components/primitives/label'
import { Switch } from '../components/primitives/switch'
import { ToggleGroup, ToggleGroupItem } from '../components/primitives/toggle-group'
import { LinkProvider, useLinkComponent, type LinkComponent, type LinkComponentProps } from '../lib/link'
import { cn } from '../lib/utils'
import {
  ThemeProvider,
  useTheme,
  type ResolvedTheme,
  type ThemePreference,
  type ThemeProviderProps,
} from '../theme/theme-provider'
import { themeInitScript } from '../theme/theme-script'

import { Code, DocSection, Snippet, TokenValue, useCssVariables } from './doc-blocks'

/* ------------------------------------------------------------------------------------------------
 * Theme switching
 * ---------------------------------------------------------------------------------------------- */

const htmlTheme = (): ResolvedTheme =>
  typeof document !== 'undefined' && document.documentElement.classList.contains('dark') ? 'dark' : 'light'

/**
 * The theme picked in the Storybook toolbar. The toolbar decorator only writes it to <html> after the
 * story has rendered (and played), so the demos start from the global rather than from the page.
 * Falls back to the page's current theme where no toolbar exists (tests).
 */
function toolbarTheme(globals: Record<string, unknown> | undefined): ResolvedTheme {
  const value = globals?.theme
  return value === 'dark' || value === 'light' ? value : htmlTheme()
}

/**
 * ThemeProvider writes to <html>, which is shared with the Storybook toolbar: when the demo unmounts,
 * put back the toolbar theme and drop the inline `color-scheme` so `tokens.css` drives it again.
 */
function RestoreHtmlTheme({ theme, children }: { theme: ResolvedTheme; children: React.ReactNode }) {
  React.useEffect(
    () => () => {
      const root = document.documentElement
      root.classList.toggle('dark', theme === 'dark')
      root.style.colorScheme = ''
    },
    [theme],
  )
  return children
}

const isPreference = (value: string): value is ThemePreference =>
  value === 'light' || value === 'dark' || value === 'system'

/** An "Appearance" setting wired to `useTheme()` (the `ThemeMenu` layout component is the ready-made version). */
function ThemePanel({ className }: { className?: string }) {
  const { theme, resolvedTheme, setTheme } = useTheme()
  return (
    <div className={cn('flex w-[360px] max-w-full flex-col overflow-hidden rounded-lg border bg-card shadow-card', className)}>
      <div className="flex flex-col gap-0.5 border-b px-5 py-3">
        <span className="text-sm font-medium text-foreground">Appearance</span>
        <span className="text-[13px] text-foreground-light">Choose how the workspace looks on this device.</span>
      </div>
      <div className="flex flex-col gap-4 px-5 py-4">
        <ToggleGroup
          type="single"
          variant="outline"
          value={theme}
          onValueChange={(next) => {
            // Single mode emits "" when the active item is clicked again: keep one option selected.
            if (isPreference(next)) setTheme(next)
          }}
          aria-label="Theme"
        >
          <ToggleGroupItem value="light">
            <Sun /> Light
          </ToggleGroupItem>
          <ToggleGroupItem value="dark">
            <Moon /> Dark
          </ToggleGroupItem>
          <ToggleGroupItem value="system">
            <Monitor /> System
          </ToggleGroupItem>
        </ToggleGroup>
        <dl className="grid grid-cols-[120px_1fr] gap-y-2 text-[13px]">
          <dt className="mono-label self-center">theme</dt>
          <dd data-testid="theme" className="font-mono text-foreground">
            {theme}
          </dd>
          <dt className="mono-label self-center">resolvedTheme</dt>
          <dd data-testid="resolved-theme" className="font-mono text-foreground">
            {resolvedTheme}
          </dd>
        </dl>
      </div>
    </div>
  )
}

/**
 * Uncontrolled provider. Without an explicit `defaultTheme` it starts from the toolbar theme; it
 * remounts when either changes so the provider and the page never disagree.
 */
function ThemeDemo({ defaultTheme, pageTheme, ...props }: ThemeProviderProps & { pageTheme: ResolvedTheme }) {
  return (
    <RestoreHtmlTheme theme={pageTheme}>
      <ThemeProvider key={`${defaultTheme ?? 'page'}-${pageTheme}`} {...props} defaultTheme={defaultTheme ?? pageTheme}>
        <ThemePanel />
      </ThemeProvider>
    </RestoreHtmlTheme>
  )
}

const meta = {
  title: 'Foundations/Theming',
  component: ThemeProvider,
  subcomponents: { LinkProvider },
  parameters: {
    docs: {
      description: {
        component:
          'Light / dark is a single `dark` class on `<html>`: `ThemeProvider` sets it (persisted in localStorage, "system" follows the OS), `useTheme()` reads it, and `themeInitScript()` applies it before first paint. For a ready-made picker use the `ThemeMenu` layout component. Brands override the CSS variables of `tokens.css`, globally or on any container. `LinkProvider` plugs your router into every libui link. The theme demos below drive the whole page, like the toolbar toggle.',
      },
    },
  },
  args: {
    storageKey: null,
    onThemeChange: fn(),
  },
  argTypes: {
    defaultTheme: { control: 'inline-radio', options: ['light', 'dark', 'system'] },
    theme: { control: false },
    children: { control: false },
    storageKey: { control: false },
  },
  render: (args, { globals }) => <ThemeDemo {...args} pageTheme={toolbarTheme(globals)} />,
} satisfies Meta<typeof ThemeProvider>

export default meta
type Story = StoryObj<typeof meta>

/**
 * `useTheme()` inside a `ThemeProvider` (here with `storageKey={null}` so nothing is persisted).
 * `theme` is the preference, `resolvedTheme` the applied value with "system" resolved. Use the
 * `defaultTheme` control to remount the provider with another initial preference.
 */
export const Default: Story = {
  name: 'Theme switcher',
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const root = document.documentElement
    const wasDark = root.classList.contains('dark')

    await userEvent.click(canvas.getByRole('radio', { name: 'Light' }))
    await expect(root).not.toHaveClass('dark')

    await userEvent.click(canvas.getByRole('radio', { name: 'Dark' }))
    await expect(root).toHaveClass('dark')
    await expect(canvas.getByTestId('resolved-theme')).toHaveTextContent('dark')
    await expect(args.onThemeChange).toHaveBeenCalledWith('dark')

    // "system" follows the operating system setting.
    await userEvent.click(canvas.getByRole('radio', { name: 'System' }))
    await expect(canvas.getByTestId('theme')).toHaveTextContent('system')
    await expect(canvas.getByTestId('resolved-theme')).toHaveTextContent(/^(light|dark)$/)

    // Leave the page in the theme it had.
    await userEvent.click(canvas.getByRole('radio', { name: wasDark ? 'Dark' : 'Light' }))
  },
}

function ControlledDemo({
  pageTheme,
  onThemeChange,
}: {
  pageTheme: ResolvedTheme
  onThemeChange?: (theme: ThemePreference) => void
}) {
  const [preference, setPreference] = React.useState<ThemePreference>(pageTheme)
  return (
    <RestoreHtmlTheme theme={pageTheme}>
      <div className="flex flex-col gap-3">
        <ThemeProvider
          theme={preference}
          storageKey={null}
          onThemeChange={(next) => {
            setPreference(next)
            onThemeChange?.(next)
          }}
        >
          <ThemePanel />
        </ThemeProvider>
        <p className="w-[360px] max-w-full text-xs text-foreground-light">
          Saved to the user profile: <Code data-testid="saved-preference">{preference}</Code>. Controlled mode lets you
          persist the preference on your server instead of localStorage.
        </p>
      </div>
    </RestoreHtmlTheme>
  )
}

/** Controlled: `theme` + `onThemeChange`, e.g. to store the preference in the user's account. */
export const Controlled: Story = {
  parameters: { controls: { disable: true } },
  render: (args, { globals }) => {
    const pageTheme = toolbarTheme(globals)
    return <ControlledDemo key={pageTheme} pageTheme={pageTheme} onThemeChange={args.onThemeChange} />
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const root = document.documentElement
    const wasDark = root.classList.contains('dark')
    const other = wasDark ? 'light' : 'dark'

    await userEvent.click(canvas.getByRole('radio', { name: wasDark ? 'Light' : 'Dark' }))
    await expect(args.onThemeChange).toHaveBeenCalledWith(other)
    await expect(canvas.getByTestId('saved-preference')).toHaveTextContent(other)
    await expect(root.classList.contains('dark')).toBe(!wasDark)

    // Leave the page in the theme it had.
    await userEvent.click(canvas.getByRole('radio', { name: wasDark ? 'Dark' : 'Light' }))
    await expect(root.classList.contains('dark')).toBe(wasDark)
  },
}

function OutsideProviderDemo() {
  const { resolvedTheme } = useTheme()
  return (
    <div className="flex w-[360px] flex-col gap-2 rounded-lg border bg-card px-5 py-4 shadow-card">
      <span className="mono-label">useTheme() without a provider</span>
      <span className="text-[13px] text-foreground-light">
        Resolved theme: <Code data-testid="outside-resolved">{resolvedTheme}</Code>
      </span>
      <span className="text-xs text-foreground-lighter">
        Toggle the toolbar theme: the value follows the <Code>dark</Code> class on {'<html>'}, whoever sets it.
        <Code>setTheme</Code> is a no-op here.
      </span>
    </div>
  )
}

/**
 * Outside a provider, `useTheme()` watches the `dark` class on `<html>` — handy for components that
 * must adapt (charts, code highlighting) when the app uses another theme library.
 */
export const UseThemeWithoutProvider: Story = {
  parameters: { controls: { disable: true } },
  render: () => <OutsideProviderDemo />,
  play: async ({ canvasElement }) => {
    const value = within(canvasElement).getByTestId('outside-resolved')
    await expect(value).toHaveTextContent(document.documentElement.classList.contains('dark') ? 'dark' : 'light')
  },
}

/**
 * `themeInitScript()` returns a tiny inline script that applies the stored preference before React
 * loads, so dark-mode users never see a white flash. Pass the same `storageKey` / `defaultTheme` as the
 * provider.
 */
export const InitScript: Story = {
  parameters: { layout: 'padded', controls: { disable: true } },
  render: () => (
    <div className="flex w-full max-w-3xl flex-col gap-4">
      <Snippet>{`// index.html (or your root layout), inside <head>
<script dangerouslySetInnerHTML={{ __html: themeInitScript() }} />

// main.tsx
<ThemeProvider defaultTheme="system">
  <App />
</ThemeProvider>`}</Snippet>
      <div className="flex flex-col gap-1.5">
        <span className="mono-label">Generated script</span>
        <Snippet className="whitespace-pre-wrap break-all">{themeInitScript()}</Snippet>
      </div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByText(/localStorage\.getItem/)).toBeInTheDocument()
  },
}

/* ------------------------------------------------------------------------------------------------
 * Token overrides
 * ---------------------------------------------------------------------------------------------- */

/** Args of the brand override demo. */
interface BrandOverrideArgs {
  /** Value for `--primary` (links, focus, active ink) and the derived bright / soft / ring tokens. */
  primary: string
  /** Value for `--primary-solid` (primary button, checked controls) and its border. */
  primarySolid: string
}

/**
 * Inline token overrides for one brand. On dark surfaces the ink (`--primary` and the tokens derived
 * from it) is lightened, like the `.dark` block of the stylesheet version: a color picked for a
 * white page is too dark for text on a dark one.
 */
function brandStyle({ primary, primarySolid }: BrandOverrideArgs, theme: ResolvedTheme): React.CSSProperties {
  const ink = theme === 'dark' ? `color-mix(in oklch, ${primary} 60%, white)` : primary
  return {
    '--primary': ink,
    '--primary-bright': ink,
    '--primary-soft': `color-mix(in oklch, ${ink} 12%, transparent)`,
    // Same alphas as the default `--ring`: 3:1 against every surface (WCAG 1.4.11).
    '--ring': `color-mix(in oklch, ${ink} ${theme === 'dark' ? 70 : 75}%, transparent)`,
    '--primary-solid': primarySolid,
    '--primary-solid-border': `color-mix(in oklch, ${primarySolid} 85%, black)`,
    '--brand': primary,
  } as React.CSSProperties
}

const brandVariables = ['--primary', '--primary-solid'] as const

/** Props of {@link BrandPreview}: the brand to apply, plus any `<div>` attribute for the scope container. */
interface BrandPreviewProps extends Omit<React.ComponentProps<'div'>, 'style' | 'children'> {
  /** Title of the card. */
  name: string
  /** Colors overridden on the scope container, for the theme the page currently shows. */
  brand: BrandOverrideArgs
}

/**
 * A scope container carrying the token overrides of one brand, around a settings card whose
 * primary-colored parts pick them up.
 */
function BrandPreview({ name, brand, ...props }: BrandPreviewProps) {
  // No provider around the story: `useTheme()` follows the `dark` class the toolbar sets on <html>.
  const { resolvedTheme } = useTheme()
  // The values are read on the scope container, so they follow its `style` when the theme flips.
  const [scope, setScope] = React.useState<HTMLDivElement | null>(null)
  const values = useCssVariables(brandVariables, scope)
  const id = React.useId()
  return (
    <div ref={setScope} style={brandStyle(brand, resolvedTheme)} {...props}>
      <div className="flex flex-col overflow-hidden rounded-lg border bg-card shadow-card">
        <div className="flex items-center justify-between gap-2 border-b px-4 py-3">
          <span className="text-sm font-medium text-foreground">{name}</span>
          <Badge variant="primary">Pro</Badge>
        </div>
        <div className="flex flex-col gap-3 px-4 py-4">
          <div className="flex items-center justify-between gap-3">
            <Label htmlFor={`${id}-digest`}>Weekly digest</Label>
            <Switch id={`${id}-digest`} defaultChecked />
          </div>
          <div className="flex items-center gap-2">
            <Checkbox id={`${id}-receipts`} defaultChecked />
            <Label htmlFor={`${id}-receipts`}>Email receipts</Label>
          </div>
          <Input size="sm" aria-label="Billing email" defaultValue="billing@acme.co" />
          <a href="#invoices" className="text-[13px] text-primary underline-offset-4 hover:underline">
            View past invoices
          </a>
        </div>
        <div className="flex items-center justify-between gap-2 border-t px-4 py-3">
          <div className="flex min-w-0 flex-col">
            <TokenValue value={values['--primary']} className="truncate" />
          </div>
          <Button variant="primary" size="sm">
            Save changes
          </Button>
        </div>
      </div>
    </div>
  )
}

/**
 * Per-product theming: override the token variables. Globally, put the overrides in your stylesheet
 * after the libui import (repeat them under `.dark` for dark-mode values); locally, set them on any
 * container. This demo sets `--primary` / `--primary-solid` (and derives the soft, ring and border
 * variants with `color-mix`) through a `style` attribute — use the controls to try colors. In dark
 * mode it lightens the `--primary` ink, as the `.dark` block of the stylesheet does.
 */
export const BrandOverride: StoryObj<BrandOverrideArgs> = {
  args: { primary: '#7c3aed', primarySolid: '#6d28d9' },
  argTypes: {
    primary: { control: 'color' },
    primarySolid: { control: 'color' },
  },
  parameters: { layout: 'padded', controls: { include: ['primary', 'primarySolid'] } },
  render: (args) => (
    <div className="grid w-full max-w-4xl gap-6 md:grid-cols-[320px_minmax(0,1fr)]">
      <BrandPreview data-testid="brand-scope" brand={args} name="Workspace settings" />
      <div className="flex min-w-0 flex-col gap-3">
        <span className="mono-label">app.css</span>
        <Snippet>{`@import "tailwindcss";
@import "libui-kit/theme.css";

:root {
  --primary: oklch(0.55 0.2 290);
  --primary-solid: oklch(0.55 0.2 290);
  --primary-solid-border: oklch(0.49 0.2 290);
  --primary-bright: oklch(0.65 0.2 290);
  --primary-soft: oklch(0.65 0.2 290 / 0.1);
  --ring: oklch(0.55 0.2 290 / 0.75);
  --brand: oklch(0.55 0.2 290);
}
.dark {
  --primary: oklch(0.75 0.14 290);   /* lighter ink on dark */
  --primary-soft: oklch(0.75 0.14 290 / 0.12);
  --ring: oklch(0.75 0.14 290 / 0.7);
}`}</Snippet>
        <p className="text-xs text-foreground-light">
          Radii (<Code>--libui-radius-*</Code>) and fonts (<Code>--libui-font-sans</Code>, <Code>--libui-font-mono</Code>)
          are overridden the same way. Never edit the alias tokens (<Code>--card</Code>, <Code>--accent</Code>…): change
          the token they point to.
        </p>
      </div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const scope = within(canvasElement).getByTestId('brand-scope')
    // The solid fill is the same in both themes; the ink is the picked color, lightened in dark mode.
    await expect(scope.style.getPropertyValue('--primary-solid')).toBe('#6d28d9')
    await expect(scope.style.getPropertyValue('--primary')).toContain('#7c3aed')
    await expect(within(scope).getByRole('button', { name: 'Save changes' })).toBeInTheDocument()
  },
}

const presets = [
  { name: 'Violet', primary: '#7c3aed', primarySolid: '#6d28d9' },
  { name: 'Teal', primary: '#0d9488', primarySolid: '#0f766e' },
  { name: 'Orange', primary: '#ea580c', primarySolid: '#c2410c' },
]

/** Overrides are scoped: each container below carries its own primary color, side by side. */
export const ScopedOverrides: Story = {
  parameters: { layout: 'padded', controls: { disable: true } },
  render: () => (
    <div className="grid w-full max-w-5xl gap-4 md:grid-cols-3">
      {presets.map((preset) => (
        <BrandPreview key={preset.name} brand={preset} name={preset.name} />
      ))}
    </div>
  ),
}

/* ------------------------------------------------------------------------------------------------
 * Router links
 * ---------------------------------------------------------------------------------------------- */

const navItems = [
  { href: '/overview', label: 'Overview' },
  { href: '/projects', label: 'Projects' },
  { href: '/team', label: 'Team members' },
  { href: '/billing', label: 'Billing' },
]

/** A minimal navigation built the way libui's own nav components are: links come from `useLinkComponent`. */
function DemoNav({ current, linkComponent }: { current: string; linkComponent?: LinkComponent }) {
  const Link = useLinkComponent(linkComponent)
  return (
    <nav aria-label="Workspace" className="flex w-52 flex-col gap-0.5 rounded-lg border bg-surface-75 p-2">
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          aria-current={item.href === current ? 'page' : undefined}
          className={cn(
            'rounded-md px-2 py-1.5 text-[13px] text-foreground-light outline-none hover:bg-surface-200 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring',
            item.href === current && 'bg-selection text-foreground',
          )}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  )
}

/** Args of the router link demo. */
interface RouterLinksArgs {
  /** Receives the `href` of every link clicked through the custom link component (instead of a page load). */
  onNavigate: (href: string) => void
}

/** Stands in for a router's navigate function (what `useNavigate()` / `useRouter()` would return). */
const NavigateContext = React.createContext<(href: string) => void>(() => {})

/**
 * A router adapter: forwards every prop to the anchor and turns plain left clicks into client-side
 * navigation (modified clicks keep the browser behavior: new tab, new window…).
 */
const DemoRouterLink: LinkComponent = ({ href, onClick, ...props }: LinkComponentProps) => {
  const navigate = React.useContext(NavigateContext)
  return (
    <a
      href={href}
      onClick={(event) => {
        onClick?.(event)
        const modified = event.metaKey || event.ctrlKey || event.shiftKey || event.altKey
        if (event.defaultPrevented || event.button !== 0 || modified || props.target === '_blank') return
        event.preventDefault()
        navigate(href)
      }}
      {...props}
    />
  )
}

function RouterLinksDemo({ onNavigate }: RouterLinksArgs) {
  const [current, setCurrent] = React.useState('/overview')
  const navigate = React.useCallback(
    (href: string) => {
      setCurrent(href)
      onNavigate(href)
    },
    [onNavigate],
  )
  return (
    <div className="flex w-full max-w-3xl flex-col gap-4 md:flex-row md:items-start">
      <NavigateContext.Provider value={navigate}>
        <LinkProvider component={DemoRouterLink}>
          <DemoNav current={current} />
        </LinkProvider>
      </NavigateContext.Provider>
      <div className="flex min-w-0 flex-1 flex-col gap-3">
        <div className="text-[13px] text-foreground-light">
          Current route: <Code data-testid="current-route">{current}</Code>
        </div>
        <Snippet>{`// react-router
const RouterLink: LinkComponent = ({ href, ...props }) => <Link to={href} {...props} />

// Next.js
const RouterLink: LinkComponent = ({ href, ...props }) => <NextLink href={href} {...props} />

<LinkProvider component={RouterLink}>
  <App />
</LinkProvider>

// One component only: every libui nav component also takes a linkComponent prop
<ResourceCard href="/projects/42" linkComponent={RouterLink} … />`}</Snippet>
      </div>
    </div>
  )
}

/**
 * `LinkProvider` makes every libui link (navigation, cards, breadcrumbs…) render through your router's
 * link instead of a plain `<a>`. The adapter receives `href` plus the usual anchor props and must forward
 * them all. A component's own `linkComponent` prop wins over the provider (`useLinkComponent(override)`).
 * Here the adapter logs clicks with `onNavigate` instead of reloading the page.
 */
export const RouterLinks: StoryObj<RouterLinksArgs> = {
  args: { onNavigate: fn() },
  argTypes: { onNavigate: { control: false } },
  parameters: { layout: 'padded', controls: { disable: true } },
  render: (args) => <RouterLinksDemo onNavigate={args.onNavigate} />,
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('link', { name: 'Projects' }))
    await expect(args.onNavigate).toHaveBeenCalledWith('/projects')
    await expect(canvas.getByTestId('current-route')).toHaveTextContent('/projects')
    await expect(canvas.getByRole('link', { name: 'Projects' })).toHaveAttribute('aria-current', 'page')
  },
}

/** Without a provider, links are plain anchors: the default works in any app, router or not. */
export const DefaultLinks: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <DocSection title="Plain anchors" description="No LinkProvider: every link is a regular <a href>.">
      {/* Docs-only guard: the demo routes do not exist, so keep the preview from navigating away. */}
      <div onClickCapture={(event) => event.preventDefault()}>
        <DemoNav current="/overview" />
      </div>
    </DocSection>
  ),
  play: async ({ canvasElement }) => {
    const link = within(canvasElement).getByRole('link', { name: 'Billing' })
    await expect(link.tagName).toBe('A')
    await expect(link).toHaveAttribute('href', '/billing')
  },
}
