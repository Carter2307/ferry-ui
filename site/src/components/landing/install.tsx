import { Code, PackageTabs } from '@/components/docs/code'
import { RouterLink } from '@/components/providers'

import { Reveal } from './reveal'
import { Heading, Section } from './ui'

const STYLES = `@import "tailwindcss";
@import "@roger.b/libui/fonts.css"; /* optional: Inter and Source Code Pro */
@import "@roger.b/libui/theme.css";`

const PROVIDERS = `import type { ReactNode } from 'react'
import { ThemeProvider, Toaster, TooltipProvider } from '@roger.b/libui'

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider defaultTheme="system">
      <TooltipProvider>
        {children}
        <Toaster />
      </TooltipProvider>
    </ThemeProvider>
  )
}`

const FIRST_SCREEN = `import { Button, EmptyState } from '@roger.b/libui'
import { FolderKanban, Plus } from 'lucide-react'

export function NoProjects({ onCreate }: { onCreate: () => void }) {
  return (
    <EmptyState
      icon={<FolderKanban />}
      title="No projects yet"
      description="Projects group your invoices, members and API keys."
      actions={
        <Button variant="primary" icon={<Plus />} onClick={onCreate}>
          New project
        </Button>
      }
    />
  )
}`

const STEPS = [
  {
    title: 'Import the styles',
    text: 'After Tailwind CSS v4, import the theme. It brings the tokens and the classes of the components.',
    code: STYLES,
    language: 'css',
    file: 'app.css',
  },
  {
    title: 'Mount the providers',
    text: 'One time, at the root of the app: the theme, the tooltips and the toasts.',
    code: PROVIDERS,
    language: 'tsx',
    file: 'providers.tsx',
  },
  {
    title: 'Use a component',
    text: 'Import each component from the package root.',
    code: FIRST_SCREEN,
    language: 'tsx',
    file: 'no-projects.tsx',
  },
]

export function Install() {
  return (
    <Section id="install" labelledBy="install-title">
      <div className="grid gap-x-16 gap-y-12 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
        <div className="min-w-0">
          <Heading id="install-title" strong="Add it to your app" quiet="in four steps" />
          <Reveal delay={0.12}>
            <p className="mt-5 max-w-[34rem] text-foreground-lighter">
              You need React 19. Tailwind CSS v4 is optional: without it, you import one compiled stylesheet.
            </p>
          </Reveal>

          <ol className="mt-10 space-y-9">
            <li>
              <Reveal>
                <h3 className="text-base font-medium text-foreground">Install the package</h3>
                <p className="mt-1 mb-3 text-sm text-foreground-lighter">
                  One package, with the components, the tokens and the stylesheets.
                </p>
                <PackageTabs packages="@roger.b/libui" />
              </Reveal>
            </li>
            {STEPS.map((step) => (
              <li key={step.title}>
                <Reveal>
                  <h3 className="text-base font-medium text-foreground">{step.title}</h3>
                  <p className="mt-1 mb-3 text-sm text-foreground-lighter">{step.text}</p>
                  <Code code={step.code} language={step.language} title={step.file} />
                </Reveal>
              </li>
            ))}
          </ol>
        </div>

        <div className="space-y-3 lg:pt-[7.75rem]">
          <Reveal delay={0.0} className="rounded-xl border bg-surface-100 p-6">
            <h3 className="text-base font-medium text-foreground">Its name on npm is @roger.b/libui</h3>
            <p className="mt-2 text-sm text-foreground-lighter">
              The name libui on npm is another project. Install{' '}
              <code className="font-mono text-[0.9em] text-foreground">@roger.b/libui</code> and import from{' '}
              <code className="font-mono text-[0.9em] text-foreground">@roger.b/libui</code>.
            </p>
            <RouterLink className="text-link mt-4 inline-block text-sm" href="/docs/overview/installation">
              Read the installation page
            </RouterLink>
          </Reveal>
          <Reveal delay={0.08} className="rounded-xl border bg-surface-100 p-6">
            <h3 className="text-base font-medium text-foreground">No Tailwind in your app?</h3>
            <p className="mt-2 text-sm text-foreground-lighter">
              Import <code className="font-mono text-[0.9em] text-foreground">@roger.b/libui/styles.css</code> at the root of
              the app. Style your own markup with plain CSS and the variables of the tokens.
            </p>
            <RouterLink className="text-link mt-4 inline-block text-sm" href="/docs/handbook/styling">
              Read about styling
            </RouterLink>
          </Reveal>
          <Reveal delay={0.16} className="rounded-xl border bg-surface-100 p-6">
            <h3 className="text-base font-medium text-foreground">Your colors, your fonts</h3>
            <p className="mt-2 text-sm text-foreground-lighter">
              Override a few CSS variables after the import to give libui the look of your product, in light and in
              dark.
            </p>
            <RouterLink className="text-link mt-4 inline-block text-sm" href="/docs/handbook/theming">
              Read about theming
            </RouterLink>
          </Reveal>
        </div>
      </div>
    </Section>
  )
}
