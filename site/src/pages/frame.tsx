import * as React from 'react'
import { EmptyState } from 'libui'
import { FileQuestion } from 'lucide-react'
import { useSearchParams } from 'react-router'

import { SiteToaster } from '@/components/providers'
import { useMounted } from '@/lib/use-mounted'

const loaders = import.meta.glob<{ default: React.ComponentType }>('../demos/**/*.tsx')

/** One lazy component per demo, by name (`app-shell/basic`). The chunk loads when the demo renders. */
const DEMOS: Record<string, React.LazyExoticComponent<React.ComponentType> | undefined> = Object.fromEntries(
  Object.entries(loaders).map(([path, load]) => [path.replace('../demos/', '').replace(/\.tsx$/, ''), React.lazy(load)]),
)

/** The full-screen examples of the library bring their own `Toaster` (src/examples/example-app.tsx). */
const HAS_OWN_TOASTER = new Set(['dashboard/app', 'list-page/app', 'detail-page/app', 'settings/app'])

/**
 * Runs one demo alone, on a full page: `/frame/?demo=app-shell/basic`. The documentation shows
 * this page in an iframe (`<Demo frame />`), so a component that fills the viewport, or that
 * changes at a breakpoint, gets a real viewport of its own.
 */
export function FramePage() {
  const [params] = useSearchParams()
  const mounted = useMounted()
  // The built HTML of this page is the same for every demo: the demo renders in the browser.
  if (!mounted) return null
  const name = params.get('demo') ?? ''
  const Component = DEMOS[name]
  if (!Component) {
    return (
      <div className="grid min-h-dvh place-items-center p-6">
        <EmptyState icon={<FileQuestion />} title="No demo with this name" description={name || 'The address has no demo name.'} />
      </div>
    )
  }
  return (
    <React.Suspense fallback={null}>
      <Component />
      {!HAS_OWN_TOASTER.has(name) && <SiteToaster />}
    </React.Suspense>
  )
}
