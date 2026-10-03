import * as React from 'react'
import { cn, useTheme } from 'ferry-ui'

import { withBase } from '@/config'

export interface ScaledFrameProps {
  /** Demo to run: the file `src/demos/<name>.tsx`. */
  name: string
  /** Accessible name of the frame. */
  title: string
  /** Width of the viewport the demo gets, in pixels (1280 for a desktop, 390 for a phone). */
  width: number
  /** Height of the frame on the page, in pixels. */
  height: number
  /** Classes for the stage around the frame. */
  className?: string
}

/**
 * Runs one demo in an iframe that has the viewport of a device. When the column is narrower than
 * the device, the frame is scaled down: a desktop demo keeps its desktop layout in a narrow column,
 * as a screenshot would, and stays live.
 */
export function ScaledFrame({ name, title, width, height, className }: ScaledFrameProps) {
  const frame = React.useRef<HTMLIFrameElement>(null)
  const stage = React.useRef<HTMLDivElement>(null)
  const { resolvedTheme } = useTheme()
  const [available, setAvailable] = React.useState<number | null>(null)
  // A stage with no width yet (a hidden pane, a closed tab panel) has nothing to scale to.
  const measured = available !== null && available > 0
  const scale = measured ? Math.min(1, available / width) : 1

  React.useEffect(() => {
    const element = stage.current
    if (!element) return
    const measure = () => setAvailable(element.clientWidth)
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  // The frame is a page of this site (same origin): it follows the theme of the page around it.
  const syncTheme = React.useCallback(() => {
    const root = frame.current?.contentDocument?.documentElement
    if (!root) return
    root.classList.toggle('dark', resolvedTheme === 'dark')
    root.style.colorScheme = resolvedTheme
  }, [resolvedTheme])
  React.useEffect(syncTheme, [syncTheme])

  return (
    <div ref={stage} data-slot="scaled-frame" className={cn('flex justify-center overflow-hidden', className)} style={{ height }}>
      <div style={{ width: width * scale, height }} className="shrink-0 overflow-hidden bg-background">
        {measured && (
          <iframe
            ref={frame}
            title={title}
            src={withBase(`frame/?demo=${encodeURIComponent(name)}`)}
            loading="lazy"
            onLoad={syncTheme}
            style={{ width, height: height / scale, transform: `scale(${scale})`, transformOrigin: 'top left' }}
            className="block max-w-none bg-background"
          />
        )}
      </div>
    </div>
  )
}
