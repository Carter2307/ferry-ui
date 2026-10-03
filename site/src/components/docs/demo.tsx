import * as React from 'react'
import { Button, Callout, CopyButton, ToggleGroup, ToggleGroupItem, cn, getErrorMessage } from 'libui'
import { ChevronsUpDown, Monitor, Smartphone, Tablet } from 'lucide-react'

import { ScaledFrame } from '@/components/scaled-frame'
import { highlightCode } from '@/lib/highlight'

/** Lines of code shown before the reader opens the full source. */
const COLLAPSED_LINES = 8

/* -------------------------------------------------------------------------------------------------
 * Error boundary: a demo that throws shows a message in its own box, and the page stays up.
 * -----------------------------------------------------------------------------------------------*/

class DemoBoundary extends React.Component<{ name?: string; children: React.ReactNode }, { error: unknown }> {
  override state: { error: unknown } = { error: null }

  static getDerivedStateFromError(error: unknown) {
    return { error }
  }

  override render() {
    if (this.state.error) {
      return (
        <Callout tone="destructive" size="sm" title={`The demo ${this.props.name ?? ''} failed to render`}>
          {getErrorMessage(this.state.error)}
        </Callout>
      )
    }
    return this.props.children
  }
}

/* -------------------------------------------------------------------------------------------------
 * Source panel
 * -----------------------------------------------------------------------------------------------*/

function DemoSource({ source }: { source: string }) {
  const code = source.trimEnd()
  const lines = code.split('\n').length
  const collapsible = lines > COLLAPSED_LINES + 2
  const [open, setOpen] = React.useState(false)
  const html = React.useMemo(() => highlightCode(code, 'tsx'), [code])
  const id = React.useId()

  return (
    <div data-slot="demo-source" className="relative border-t bg-surface-75">
      <div className="absolute top-1.5 right-1.5 z-10">
        <CopyButton value={code} what="code" variant="ghost" />
      </div>
      <pre
        id={id}
        // 1.7 × 12.5px = 21.25px per line, plus the top padding.
        style={collapsible && !open ? { maxHeight: COLLAPSED_LINES * 21.25 + 14 } : undefined}
        className={cn(
          'overflow-x-auto py-3.5 pr-12 pl-4 font-mono text-[12.5px] leading-[1.7] text-foreground',
          collapsible && !open && 'overflow-hidden mask-b-from-40%',
          collapsible && open && 'max-h-[32rem] overflow-y-auto pb-12',
        )}
      >
        <code dangerouslySetInnerHTML={{ __html: html }} />
      </pre>
      {collapsible && (
        <div className={cn('flex justify-center', open ? 'absolute inset-x-0 bottom-2.5' : 'absolute inset-x-0 bottom-2.5')}>
          <Button size="tiny" aria-expanded={open} aria-controls={id} onClick={() => setOpen((value) => !value)} icon={<ChevronsUpDown />}>
            {open ? 'Hide code' : 'Show code'}
          </Button>
        </div>
      )}
    </div>
  )
}

/* -------------------------------------------------------------------------------------------------
 * Framed preview (iframe): a real viewport for components that fill the screen.
 * -----------------------------------------------------------------------------------------------*/

const VIEWPORTS = [
  { id: 'desktop', label: 'Desktop', width: 1280, icon: <Monitor /> },
  { id: 'tablet', label: 'Tablet', width: 820, icon: <Tablet /> },
  { id: 'phone', label: 'Phone', width: 390, icon: <Smartphone /> },
] as const

type ViewportId = (typeof VIEWPORTS)[number]['id']

function FramedPreview({ name, title, height, start }: { name: string; title: string; height: number; start: ViewportId }) {
  const [viewport, setViewport] = React.useState<ViewportId>(start)
  const width = VIEWPORTS.find((entry) => entry.id === viewport)?.width ?? 1280

  return (
    <>
      <div className="flex items-center justify-between gap-3 border-b bg-surface-75 px-3 py-2">
        <span className="truncate text-[13px] text-foreground-light">{title}</span>
        <ToggleGroup
          type="single"
          size="tiny"
          aria-label="Preview width"
          value={viewport}
          onValueChange={(value) => {
            // Single mode sends "" when the active item is pressed again: keep one width selected.
            const next = VIEWPORTS.find((entry) => entry.id === value)
            if (next) setViewport(next.id)
          }}
        >
          {VIEWPORTS.map((entry) => (
            <ToggleGroupItem key={entry.id} value={entry.id} aria-label={`${entry.label}, ${entry.width} pixels`}>
              {entry.icon}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>
      <ScaledFrame name={name} title={title} width={width} height={height} className="bg-dot-grid [&>div]:border-x" />
    </>
  )
}

/* -------------------------------------------------------------------------------------------------
 * Demo
 * -----------------------------------------------------------------------------------------------*/

export interface DemoProps {
  /** File of the demo under `src/demos`, without extension: `button/variants`. */
  name: string
  /** What the demo shows, in a few words. It names the preview for screen readers. */
  title?: string
  /**
   * How the preview holds the demo: `center` (default) puts it in the middle, `start` puts it at
   * the top left, `stretch` gives it the full width (tables, cards, forms).
   */
  align?: 'center' | 'start' | 'stretch'
  /**
   * Run the demo in an iframe, with buttons for the desktop, tablet and phone widths. Use it for
   * components that fill the viewport or change at a breakpoint (the layout components).
   */
  frame?: boolean
  /** Height of the framed preview in pixels. Default 560. */
  height?: number
  /**
   * Width the framed preview starts with: `desktop` (default), `tablet` or `phone`. Use `phone`
   * for a component that only shows on a phone. The reader can change the width.
   */
  viewport?: 'desktop' | 'tablet' | 'phone'
  /** Extra classes for the preview area (for example a minimum height). */
  className?: string
  /** Set by the build from `name`: the demo component. */
  component?: React.ComponentType
  /** Set by the build from `name`: the source code shown under the preview. */
  source?: string
}

/**
 * A live example with its source: the component of `src/demos/<name>.tsx` in a preview box, and
 * the same file as code under it. The reader sees what the code does, then copies the code.
 */
export function Demo({
  name,
  title,
  align = 'center',
  frame = false,
  height = 560,
  viewport = 'desktop',
  className,
  component: Component,
  source,
}: DemoProps) {
  const label = title ?? `Example: ${name.replace(/[/-]/g, ' ')}`
  return (
    <div data-slot="demo" data-demo={name} className="not-prose overflow-hidden rounded-lg border bg-background">
      {frame ? (
        <FramedPreview name={name} title={label} height={height} start={viewport} />
      ) : (
        <div
          role="group"
          aria-label={label}
          data-slot="demo-preview"
          className={cn(
            'flex min-h-44 p-6 sm:p-8',
            align === 'center' && 'flex-wrap items-center justify-center gap-3',
            align === 'start' && 'flex-wrap items-start justify-start gap-3',
            align === 'stretch' && 'flex-col items-stretch justify-center',
            className,
          )}
        >
          <DemoBoundary name={name}>{Component ? <Component /> : null}</DemoBoundary>
        </div>
      )}
      {source !== undefined && <DemoSource source={source} />}
    </div>
  )
}
