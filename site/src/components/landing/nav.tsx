import * as React from 'react'
import { Button, Kbd, cn, useModKey, useTheme } from 'libui'
import { Moon, Search, Sun } from 'lucide-react'

import { GithubIcon, Wordmark } from '@/components/logo'
import { RouterLink } from '@/components/providers'
import { DOCS_HOME, GITHUB_URL } from '@/config'
import { useMounted } from '@/lib/use-mounted'

const LINKS = [
  { label: 'Docs', href: DOCS_HOME },
  { label: 'Components', href: '/docs/components/button' },
  { label: 'Examples', href: '/docs/examples/dashboard' },
  { label: 'Tokens', href: '/docs/handbook/tokens' },
]

/** Switches between the light and the dark theme. The icon shows the theme the click gives. */
export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const mounted = useMounted()
  // The stored theme is not known on the server: the icon comes with the first client render.
  const dark = mounted && resolvedTheme === 'dark'
  return (
    <Button
      variant="ghost"
      size="icon-md"
      aria-label={dark ? 'Switch to the light theme' : 'Switch to the dark theme'}
      onClick={() => setTheme(dark ? 'light' : 'dark')}
      icon={mounted ? dark ? <Sun /> : <Moon /> : <span className="size-4" />}
    />
  )
}

const subscribeScroll = (onChange: () => void) => {
  window.addEventListener('scroll', onChange, { passive: true })
  return () => window.removeEventListener('scroll', onChange)
}

/**
 * The header of the landing page: transparent, with a blur of what is behind it. At the top of the
 * page the pixel field shows through it. After the first scroll it takes a hairline and a light
 * tint, so the links stay easy to read over the content that passes under them.
 */
export function Nav({ onSearch }: { onSearch: () => void }) {
  const mod = useModKey()
  const scrolled = React.useSyncExternalStore(
    subscribeScroll,
    () => window.scrollY > 8,
    () => false,
  )
  return (
    <header
      data-scrolled={scrolled ? '' : undefined}
      className={cn(
        'sticky top-0 z-30 border-b border-transparent bg-transparent backdrop-blur-md transition-[background-color,border-color] duration-300',
        'data-[scrolled]:border-border data-[scrolled]:bg-background/45',
      )}
    >
      <div className="container-page flex h-16 items-center gap-6">
        <RouterLink
          href="/"
          aria-label="libui home"
          className="rounded-md outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Wordmark />
        </RouterLink>
        <nav aria-label="Main" className="hidden items-center gap-0.5 md:flex">
          {LINKS.map((link) => (
            <Button key={link.label} asChild variant="ghost" size="md">
              <RouterLink href={link.href}>{link.label}</RouterLink>
            </Button>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-1.5">
          <Button size="md" icon={<Search />} onClick={onSearch} aria-keyshortcuts="Meta+K Control+K" className="max-lg:hidden">
            <span className="pr-6 text-foreground-lighter">Search the docs</span>
            <Kbd>{mod} K</Kbd>
          </Button>
          <Button variant="ghost" size="icon-md" icon={<Search />} onClick={onSearch} aria-label="Search the docs" className="lg:hidden" />
          <Button asChild variant="ghost" size="icon-md" icon={<GithubIcon />} className="max-sm:hidden">
            <a href={GITHUB_URL} aria-label="libui on GitHub" />
          </Button>
          <ThemeToggle />
          <Button asChild variant="primary" size="md" className="ml-1.5">
            <RouterLink href={DOCS_HOME}>
              <span className="sm:hidden">Docs</span>
              <span className="max-sm:hidden">Get started</span>
            </RouterLink>
          </Button>
        </div>
      </div>
    </header>
  )
}
