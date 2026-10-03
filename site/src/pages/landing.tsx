import * as React from 'react'
import { useCommandShortcut } from 'libui'
import { MotionConfig } from 'motion/react'

import { HeroBackdrop, PageEndBackdrop, PageRails } from '@/components/landing/backdrop'
import { Features } from '@/components/landing/features'
import { FinalCta } from '@/components/landing/final-cta'
import { Footer } from '@/components/landing/footer'
import { Hero } from '@/components/landing/hero'
import { Install } from '@/components/landing/install'
import { Nav } from '@/components/landing/nav'
import { OpenSource } from '@/components/landing/open-source'
import { Showcase } from '@/components/landing/showcase'
import { Stack } from '@/components/landing/stack'
import { SiteToaster } from '@/components/providers'
import { SiteSearch } from '@/components/site-search'
import { usePageMeta } from '@/lib/use-page-meta'

/** The landing page. Every control on it is a libui component, and the demos are live. */
export function LandingPage() {
  usePageMeta()
  const [searchOpen, setSearchOpen] = React.useState(false)
  useCommandShortcut(() => setSearchOpen((open) => !open))

  React.useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    // A reader who asks for reduced motion gets the fades with no movement.
    <MotionConfig reducedMotion="user">
      <div className="relative isolate overflow-x-clip text-base leading-normal">
        <PageRails />
        <HeroBackdrop />
        <PageEndBackdrop />
        <a
          href="#main"
          className="sr-only z-50 rounded-md bg-surface-300 text-sm text-foreground outline-none focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:border focus:border-border-strong focus:px-3 focus:py-2 focus:shadow-overlay focus:ring-2 focus:ring-ring"
        >
          Skip to content
        </a>
        <Nav onSearch={() => setSearchOpen(true)} />
        <main id="main">
          <Hero />
          <Showcase />
          <Stack />
          <Features onSearch={() => setSearchOpen(true)} />
          <Install />
          <OpenSource />
          <FinalCta />
        </main>
        <Footer />
        <SiteSearch open={searchOpen} onOpenChange={setSearchOpen} />
        <SiteToaster />
      </div>
    </MotionConfig>
  )
}
