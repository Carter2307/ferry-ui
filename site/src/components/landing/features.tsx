import * as React from 'react'
import {
  Button,
  Card,
  Checkbox,
  ConfirmDialog,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Field,
  IconBox,
  Input,
  Kbd,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  StatusBadge,
  Switch,
  ToggleGroup,
  ToggleGroupItem,
  cn,
  toast,
  useModKey,
  useTheme,
  type ThemePreference,
} from 'libui'
import { ChevronDown, FolderKanban, Search } from 'lucide-react'

import { Code } from '@/components/docs/code'
import { RouterLink } from '@/components/providers'
import { withBase } from '@/config'
import { useMounted } from '@/lib/use-mounted'

import { Divider } from './backdrop'
import { Reveal } from './reveal'

/** One card of the grid: a claim, one sentence, and the real components under them. */
function FeatureCard({
  title,
  text,
  delay = 0,
  className,
  children,
}: {
  title: string
  text: string
  /** Seconds before the card appears: cards of one row come one after the other. */
  delay?: number
  className?: string
  children: React.ReactNode
}) {
  return (
    <Reveal delay={delay} y={18} className={className}>
      <Card className="h-full rounded-xl">
        <div className="px-6 pt-6">
          <h3 className="text-base font-medium text-foreground">{title}</h3>
          <p className="mt-2 max-w-[27rem] text-sm text-foreground-lighter">{text}</p>
        </div>
        <div className="flex flex-1 flex-col justify-end p-6">{children}</div>
      </Card>
    </Reveal>
  )
}

/** A small form made of primitives: a field, a select, a checkbox, a switch and two buttons. */
function PrimitivesDemo() {
  return (
    <form
      className="flex flex-col gap-4 rounded-lg border bg-background p-5"
      onSubmit={(event) => {
        event.preventDefault()
        toast.success('API key created')
      }}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Key name">
          <Input defaultValue="Production" />
        </Field>
        <Field label="Role">
          {(control) => (
            <Select defaultValue="editor">
              <SelectTrigger {...control} className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="viewer">Viewer</SelectItem>
                <SelectItem value="editor">Editor</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          )}
        </Field>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
        <Label>
          <Checkbox defaultChecked />
          Send me a copy by email
        </Label>
        <div className="flex items-center gap-2">
          <Switch id="landing-expiry" defaultChecked />
          <Label htmlFor="landing-expiry">Expires in 90 days</Label>
        </div>
      </div>
      <div className="flex justify-end gap-2 border-t pt-4">
        <Button type="reset">Reset</Button>
        <Button type="submit" variant="primary">
          Create key
        </Button>
      </div>
    </form>
  )
}

const SWATCHES = [
  { name: 'surface-75', className: 'bg-surface-75' },
  { name: 'surface-200', className: 'bg-surface-200' },
  { name: 'border-strong', className: 'bg-border-strong' },
  { name: 'foreground', className: 'bg-foreground' },
  { name: 'primary-solid', className: 'bg-primary-solid' },
  { name: 'success', className: 'bg-success' },
  { name: 'warning', className: 'bg-warning' },
  { name: 'destructive', className: 'bg-destructive' },
]

const isPreference = (value: string): value is ThemePreference => value === 'light' || value === 'dark' || value === 'system'

/** Token swatches and the theme switch: a click changes the whole page, which proves the claim. */
function TokensDemo() {
  const { theme, setTheme } = useTheme()
  const mounted = useMounted()
  return (
    <div className="flex flex-col gap-5">
      <ul className="grid grid-cols-4 gap-2.5" aria-label="Some color tokens">
        {SWATCHES.map((swatch) => (
          <li key={swatch.name} className="flex flex-col gap-1.5">
            <span className={cn('h-11 rounded-md border', swatch.className)} />
            <span className="truncate text-xs text-foreground-lighter">{swatch.name}</span>
          </li>
        ))}
      </ul>
      <div className="flex flex-wrap items-center justify-between gap-3 border-t pt-4">
        <span className="text-sm text-foreground-light">Try the other theme</span>
        <ToggleGroup
          type="single"
          variant="outline"
          aria-label="Theme"
          // The stored preference is not known on the server.
          value={mounted ? theme : ''}
          onValueChange={(next) => {
            if (isPreference(next)) setTheme(next)
          }}
        >
          <ToggleGroupItem value="light">Light</ToggleGroupItem>
          <ToggleGroupItem value="dark">Dark</ToggleGroupItem>
          <ToggleGroupItem value="system">System</ToggleGroupItem>
        </ToggleGroup>
      </div>
    </div>
  )
}

/** A record with its status, and the confirm dialog that guards its deletion. */
function PatternsDemo() {
  return (
    <div className="flex flex-col gap-4 rounded-lg border bg-background p-4">
      <div className="flex items-center gap-3">
        <IconBox size="sm">
          <FolderKanban />
        </IconBox>
        <span className="min-w-0 flex-1 truncate text-sm text-foreground">Billing portal</span>
        <StatusBadge tone="success" label="Active" />
      </div>
      <ConfirmDialog
        trigger={
          <Button variant="destructive" className="w-full">
            Delete project
          </Button>
        }
        title="Delete the project Billing portal?"
        description="The project, its invoices and its API keys go away. You cannot undo this."
        confirmLabel="Delete project"
        onConfirm={() => new Promise<void>((resolve) => window.setTimeout(resolve, 900))}
      />
    </div>
  )
}

/** A drawing of the application frame, and the real command menu of this site behind a button. */
function ShellDemo({ onSearch }: { onSearch: () => void }) {
  const mod = useModKey()
  return (
    <div className="flex flex-col gap-4">
      <div aria-hidden="true" className="overflow-hidden rounded-lg border bg-background">
        <div className="flex h-7 items-center gap-2 border-b px-2.5">
          <span className="size-2.5 rounded-sm bg-brand" />
          <span className="h-1.5 w-10 rounded-full bg-surface-200" />
          <span className="ml-auto h-3.5 w-16 rounded-sm border bg-surface-75" />
        </div>
        <div className="flex h-24">
          <div className="flex w-8 flex-col items-center gap-2 border-r py-2.5">
            <span className="size-3 rounded-sm bg-selection ring-1 ring-border-strong" />
            <span className="size-3 rounded-sm bg-surface-200" />
            <span className="size-3 rounded-sm bg-surface-200" />
          </div>
          <div className="flex flex-1 flex-col gap-2 p-3">
            <span className="h-2 w-20 rounded-full bg-foreground-muted" />
            <div className="grid flex-1 grid-cols-3 gap-2">
              <span className="rounded-md border bg-surface-75" />
              <span className="rounded-md border bg-surface-75" />
              <span className="rounded-md border bg-surface-75" />
            </div>
          </div>
        </div>
      </div>
      <Button icon={<Search />} onClick={onSearch} className="w-full justify-between">
        <span className="flex-1 text-left">Open the command menu</span>
        <Kbd>{mod} K</Kbd>
      </Button>
    </div>
  )
}

const KEYS = [
  { keys: ['Tab'], action: 'Move the focus to the button' },
  { keys: ['Enter'], action: 'Open the menu' },
  { keys: ['↑', '↓'], action: 'Move in the menu' },
  { keys: ['Esc'], action: 'Close the menu' },
]

/** A real menu to try with the keyboard, and the keys that drive it. */
function AccessibilityDemo() {
  return (
    <div className="flex flex-col gap-4">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button iconRight={<ChevronDown />} className="w-fit">
            Project actions
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-48">
          <DropdownMenuItem onSelect={() => toast('Renamed')}>Rename</DropdownMenuItem>
          <DropdownMenuItem onSelect={() => toast('Duplicated')}>Duplicate</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive" onSelect={() => toast('Archived')}>
            Archive
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <dl className="flex flex-col gap-2 border-t pt-4 text-sm">
        {KEYS.map((entry) => (
          <div key={entry.action} className="flex items-center justify-between gap-3">
            <dt className="text-foreground-light">{entry.action}</dt>
            <dd className="flex gap-1">
              {entry.keys.map((key) => (
                <Kbd key={key}>{key}</Kbd>
              ))}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  )
}

const LLMS_EXCERPT = `# libui

> libui is a React 19 design system for product interfaces.

## Primitives

- [Button](/docs/components/button.md): A control that starts an action.
- [Dialog](/docs/components/dialog.md): A window on top of the page.`

const ADAPTER = `import { Link } from 'react-router'
import { LinkProvider, type LinkComponent } from 'libui'

const RouterLink: LinkComponent = ({ href, ...props }) => (
  <Link to={href} {...props} />
)

<LinkProvider component={RouterLink}>{app}</LinkProvider>`

export function Features({ onSearch }: { onSearch: () => void }) {
  return (
    <section id="features" aria-labelledby="features-title">
      <Divider delay="-3s" />
      <div className="container-page py-20 lg:py-28">
        <h2 id="features-title" className="heading-section max-w-[40rem]">
          <Reveal as="span" className="block text-foreground">
            Every layer of the screen
          </Reveal>
          <Reveal as="span" delay={0.07} className="block text-foreground-lighter">
            Try each one here
          </Reveal>
        </h2>

        <div className="mt-12 grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-12 2xl:gap-4">
          <FeatureCard
            title="28 accessible primitives"
            text="Buttons, fields, menus, dialogs and tables on Radix UI. The sizes have the same names in every control, so a row of controls lines up."
            className="md:col-span-2 lg:col-span-7"
          >
            <PrimitivesDemo />
          </FeatureCard>
          <FeatureCard
            title="One set of tokens"
            text="Each color, radius and font is a CSS variable with a Tailwind class. The dark theme is one class on the page."
            delay={0.08}
            className="md:col-span-2 lg:col-span-5"
          >
            <TokensDemo />
          </FeatureCard>
          <FeatureCard
            title="22 patterns"
            text="Page headers, form cards, table states, empty states and confirm dialogs: the parts you build again in each product."
            className="lg:col-span-4"
          >
            <PatternsDemo />
          </FeatureCard>
          <FeatureCard
            title="The application shell"
            text="A top bar, an icon rail, a phone drawer and a command menu, all from one list of pages."
            delay={0.08}
            className="lg:col-span-4"
          >
            <ShellDemo onSearch={onSearch} />
          </FeatureCard>
          <FeatureCard
            title="Keyboard and screen readers"
            text="Focus, ARIA names and keys come with the components. Put the mouse away and try this menu."
            delay={0.16}
            className="md:col-span-2 lg:col-span-4"
          >
            <AccessibilityDemo />
          </FeatureCard>
          <FeatureCard
            title="Written for your AI agent too"
            text="The repository has an AGENTS.md guide with rules and type-checked snippets. Each page of these docs has a Markdown version, and llms.txt lists them."
            className="md:col-span-2 lg:col-span-6"
          >
            <div className="flex flex-col gap-3">
              <Code code={LLMS_EXCERPT} language="text" title="llms.txt" />
              <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
                <a className="text-link" href={withBase('llms.txt')}>
                  Open llms.txt
                </a>
                <RouterLink className="text-link" href="/docs/handbook/ai-agents">
                  Read the guide for AI agents
                </RouterLink>
              </div>
            </div>
          </FeatureCard>
          <FeatureCard
            title="Your router, your state"
            text="A link is an href string that goes through one adapter. A component holds no global state: you control it with props."
            delay={0.08}
            className="md:col-span-2 lg:col-span-6"
          >
            <div className="flex flex-col gap-3">
              <Code code={ADAPTER} language="tsx" title="providers.tsx" />
              <div className="text-sm">
                <RouterLink className="text-link" href="/docs/handbook/routing">
                  Read about routing
                </RouterLink>
              </div>
            </div>
          </FeatureCard>
        </div>

        <Reveal className="mt-14">
          <p className="max-w-[46rem] text-xl leading-snug font-medium text-foreground-lighter sm:text-2xl">
            <span className="text-foreground">One package, one import.</span> The page you read now uses the same
            components: its navigation, its search, its code blocks and its tables are libui.
          </p>
        </Reveal>
      </div>
    </section>
  )
}
