import * as React from 'react'
import { Button, Tabs, TabsList, TabsTrigger } from 'libui'
import { ArrowRight } from 'lucide-react'

import { RouterLink } from '@/components/providers'
import { ScaledFrame } from '@/components/scaled-frame'

import { Reveal } from './reveal'

const SCREENS = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    note: 'The application frame with info tiles, metric cards, a grid of projects and a command menu.',
  },
  {
    id: 'list-page',
    label: 'List page',
    note: 'A toolbar with search and filters above a table, with its loading, empty and error states.',
  },
  {
    id: 'detail-page',
    label: 'Detail page',
    note: 'A page header with a status, a description list, tabs and confirmations for the risky actions.',
  },
  {
    id: 'settings',
    label: 'Settings',
    note: 'A side menu, form cards with validation, save actions and a danger zone.',
  },
] as const

type ScreenId = (typeof SCREENS)[number]['id']

const PHONE = '(max-width: 639px)'
const subscribePhone = (onChange: () => void) => {
  const query = window.matchMedia(PHONE)
  query.addEventListener('change', onChange)
  return () => query.removeEventListener('change', onChange)
}

/**
 * The product itself as the picture of the page: four full screens built only with libui, live in
 * a frame. A phone gets the phone layout of each screen, a wider window gets the desktop layout.
 */
export function Showcase() {
  const [screen, setScreen] = React.useState<ScreenId>('dashboard')
  const phone = React.useSyncExternalStore(
    subscribePhone,
    () => window.matchMedia(PHONE).matches,
    () => false,
  )
  const current = SCREENS.find((entry) => entry.id === screen) ?? SCREENS[0]

  return (
    <section aria-labelledby="showcase-title" className="container-page pb-20 lg:pb-28">
      <h2 id="showcase-title" className="sr-only">
        Screens built with libui
      </h2>
      <Reveal immediate delay={0.32} y={20}>
        <Tabs value={screen} onValueChange={(value) => setScreen(value as ScreenId)}>
          <TabsList variant="pills" aria-label="Example screens">
            {SCREENS.map((entry) => (
              <TabsTrigger key={entry.id} value={entry.id}>
                {entry.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <div className="mt-4 overflow-hidden rounded-xl border border-border-strong bg-surface-100 shadow-overlay">
          <div className="flex h-9 items-center gap-1.5 border-b px-4" aria-hidden="true">
            {[0, 1, 2].map((dot) => (
              <span key={dot} className="size-2.5 rounded-full bg-border-stronger" />
            ))}
          </div>
          <ScaledFrame
            key={`${screen}-${phone ? 'phone' : 'desktop'}`}
            name={`${screen}/app`}
            title={`${current.label}: a live example screen`}
            width={phone ? 390 : 1280}
            height={phone ? 600 : 640}
          />
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-x-8 gap-y-3">
          <p className="max-w-[44rem] text-sm text-foreground-lighter">
            <span className="text-foreground">This is not a picture.</span> Click in the screen. {current.note}
          </p>
          <Button asChild variant="link" iconRight={<ArrowRight />}>
            <RouterLink href={`/docs/examples/${screen}`}>See how it is built</RouterLink>
          </Button>
        </div>
      </Reveal>
    </section>
  )
}
