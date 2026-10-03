import { Button } from 'libui-kit'
import { ArrowRight } from 'lucide-react'

import { GithubIcon } from '@/components/logo'
import { RouterLink } from '@/components/providers'
import { DOCS_HOME, GITHUB_URL } from '@/config'

import { Reveal } from './reveal'

export function HeroActions() {
  return (
    <>
      <Button asChild variant="primary" size="lg" iconRight={<ArrowRight />}>
        <RouterLink href={DOCS_HOME}>Get started</RouterLink>
      </Button>
      <Button asChild size="lg" icon={<GithubIcon />}>
        <a href={GITHUB_URL}>View on GitHub</a>
      </Button>
    </>
  )
}

export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="container-page pt-16 pb-12 sm:pt-24 lg:pt-28 lg:pb-14">
      <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
        <div>
          <h1 id="hero-title" className="heading-hero">
            <Reveal as="span" immediate className="block">
              Product screens,
            </Reveal>
            <Reveal as="span" immediate delay={0.08} className="block text-primary">
              already designed
            </Reveal>
          </h1>
          <Reveal immediate delay={0.24} className="mt-8 flex flex-wrap gap-3 max-lg:hidden">
            <HeroActions />
          </Reveal>
        </div>
        <div className="lg:pt-2">
          <Reveal immediate delay={0.16}>
            <p className="max-w-[33rem] text-foreground-light sm:text-lg">
              libui is a React design system for dashboards, admin consoles and developer tools. You get the tokens,
              the controls, the page patterns and the application shell, so you start from a finished screen.
            </p>
          </Reveal>
          <Reveal immediate delay={0.24} className="mt-8 flex flex-wrap gap-3 lg:hidden">
            <HeroActions />
          </Reveal>
        </div>
      </div>
    </section>
  )
}
