import type { CSSProperties } from 'react'
import { cn } from 'libui'

import { PixelField } from './pixel-field'

/** Inline custom properties of one beam: how long one pass takes, when it starts, how far it goes. */
type BeamStyle = CSSProperties & { '--duration'?: string; '--delay'?: string; '--travel'?: string }

/** The background of the top of the page: a pixel field that starts at the very top and thins out downward. */
export function HeroBackdrop() {
  return <PixelField from="top" className="absolute inset-x-0 top-0 -z-10 h-[46rem]" />
}

/**
 * The background of the end of the page: a pixel field that starts at the very bottom and thins
 * out upward. The footer leaves a free band under its last line for it (see footer.tsx).
 */
export function FooterBackdrop() {
  return <PixelField from="bottom" className="absolute inset-x-0 bottom-0 -z-10 h-[26rem]" />
}

/**
 * Two hairlines down the whole page, at the edges of the page column, each with slow beams: short
 * lines of light that run along the hairline. The motion is a CSS animation on `transform` (see
 * `.rail-runner` in site.css), and it stops for readers who ask for reduced motion. The rails show
 * on screens wide enough to have a margin outside the column.
 */
export function PageRails() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 hidden overflow-hidden min-[86rem]:block">
      <div className="relative mx-auto h-full max-w-[80rem]">
        {(['left-0', 'right-0'] as const).map((side, index) => (
          <div key={side} className={cn('absolute inset-y-0 w-px bg-border', side)}>
            {[0, 1, 2].map((beam) => (
              <span
                key={beam}
                className="rail-runner"
                style={{ '--duration': '84s', '--delay': `${-(beam * 28 + index * 14)}s` } as BeamStyle}
              >
                <span className="beam-segment" />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

/** The hairline between two sections, with one beam that runs along it. */
export function Divider({ delay = '0s', reverse = false, className }: { delay?: string; reverse?: boolean; className?: string }) {
  const style: BeamStyle = { top: 0, '--duration': '16s', '--delay': delay, '--travel': '100vw' }
  return (
    <div aria-hidden="true" className={cn('relative h-px overflow-hidden bg-border', className)}>
      <span className={cn('beam beam-x', reverse && 'beam-reverse')} style={style} />
    </div>
  )
}
