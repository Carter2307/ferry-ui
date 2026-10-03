import {
  siLucide,
  siNextdotjs,
  siRadixui,
  siReact,
  siReactrouter,
  siShadcnui,
  siStorybook,
  siTailwindcss,
  siTanstack,
  siTypescript,
  siVite,
  siVitest,
} from 'simple-icons'

import { BrandIcon } from '@/components/logo'

import { Divider } from './backdrop'
import { Reveal } from './reveal'

/** What libui is built on, then what it runs in. */
const ITEMS = [
  { icon: siReact, name: 'React 19' },
  { icon: siTypescript, name: 'TypeScript' },
  { icon: siTailwindcss, name: 'Tailwind CSS v4' },
  { icon: siRadixui, name: 'Radix UI' },
  { icon: siShadcnui, name: 'shadcn/ui' },
  { icon: siLucide, name: 'Lucide' },
  { icon: siVite, name: 'Vite' },
  { icon: siNextdotjs, name: 'Next.js' },
  { icon: siReactrouter, name: 'React Router' },
  { icon: siTanstack, name: 'TanStack Router' },
  { icon: siStorybook, name: 'Storybook' },
  { icon: siVitest, name: 'Vitest' },
]

export function Stack() {
  return (
    <section aria-labelledby="stack-title">
      <div className="container-page">
        <Reveal>
          <h2 id="stack-title" className="pb-6 text-sm font-normal text-foreground-lighter">
            Built on the stack you already use
          </h2>
        </Reveal>
      </div>
      {/* The line of the next section closes the band. */}
      <div>
        <Divider delay="-7s" reverse />
        <Reveal className="container-page">
          <ul className="grid grid-cols-2 border-x sm:grid-cols-3 lg:grid-cols-6">
            {ITEMS.map((item) => (
              <li
                key={item.name}
                className="flex items-center justify-center gap-2.5 px-3 py-7 text-foreground-lighter transition-colors hover:text-foreground"
              >
                <BrandIcon path={item.icon.path} className="size-5 shrink-0" />
                <span className="text-[15px] font-medium">{item.name}</span>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  )
}
