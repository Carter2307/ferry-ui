import { GithubIcon, Wordmark } from '@/components/logo'
import { RouterLink } from '@/components/providers'
import { DOCS_HOME, GITHUB_URL, LICENSE_URL } from '@/config'

import { Divider, FooterBackdrop } from './backdrop'
import { ThemeToggle } from './nav'

const COLUMNS = [
  {
    title: 'Start',
    links: [
      { label: 'Quick start', href: DOCS_HOME },
      { label: 'Installation', href: '/docs/overview/installation' },
      { label: 'Accessibility', href: '/docs/overview/accessibility' },
      { label: 'About libui', href: '/docs/overview/about' },
    ],
  },
  {
    title: 'Handbook',
    links: [
      { label: 'Styling', href: '/docs/handbook/styling' },
      { label: 'Tokens', href: '/docs/handbook/tokens' },
      { label: 'Theming', href: '/docs/handbook/theming' },
      { label: 'Forms', href: '/docs/handbook/forms' },
      { label: 'AI agents', href: '/docs/handbook/ai-agents' },
    ],
  },
  {
    title: 'Components',
    links: [
      { label: 'Button', href: '/docs/components/button' },
      { label: 'Dialog', href: '/docs/components/dialog' },
      { label: 'Table', href: '/docs/components/table' },
      { label: 'Form Card', href: '/docs/components/form-card' },
      { label: 'App Shell', href: '/docs/components/app-shell' },
    ],
  },
  {
    title: 'Project',
    links: [
      { label: 'GitHub', href: GITHUB_URL },
      { label: 'Releases', href: '/docs/overview/releases' },
      { label: 'MIT license', href: LICENSE_URL },
      { label: 'llms.txt', href: '/llms.txt' },
    ],
  },
]

export function Footer() {
  return (
    // `isolate` keeps the pixel field of the footer above the footer's own background.
    <footer className="relative isolate overflow-hidden bg-background">
      <Divider delay="-5s" />
      <FooterBackdrop />
      <div className="container-page grid gap-12 py-16 lg:grid-cols-[minmax(0,2fr)_repeat(4,minmax(0,1fr))]">
        <div>
          <RouterLink href="/" aria-label="libui home" className="inline-block rounded-md outline-none focus-visible:ring-2 focus-visible:ring-ring">
            <Wordmark />
          </RouterLink>
          <p className="mt-4 max-w-[17rem] text-sm text-foreground-lighter">
            A React design system for dashboards, admin consoles and developer tools.
          </p>
          <a
            href={GITHUB_URL}
            aria-label="libui on GitHub"
            className="mt-5 inline-grid size-8 place-items-center rounded-md text-foreground-lighter transition-colors outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
          >
            <GithubIcon className="size-5" />
          </a>
        </div>
        <div className="grid grid-cols-2 gap-10 sm:grid-cols-4 lg:col-span-4">
          {COLUMNS.map((column) => (
            <nav key={column.title} aria-label={column.title}>
              <h2 className="text-sm font-medium text-foreground">{column.title}</h2>
              <ul className="mt-4 space-y-2.5 text-sm">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <RouterLink href={link.href} className="rounded-sm text-foreground-lighter transition-colors outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring">
                      {link.label}
                    </RouterLink>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
      </div>
      <div className="container-page flex items-center justify-between border-t py-5 text-[13px] text-foreground-lighter">
        <span>libui is open source under the MIT license.</span>
        <ThemeToggle />
      </div>
      {/* A free band at the end of the page: the pixel field is dense here. */}
      <div aria-hidden="true" className="h-36 sm:h-48" />
    </footer>
  )
}
