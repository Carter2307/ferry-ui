import type { ReactNode } from 'react'
import { motion } from 'motion/react'

/** A soft ease-out: fast at the start, a long calm end. */
const EASE = [0.22, 1, 0.36, 1] as const

export interface RevealProps {
  children: ReactNode
  /** Seconds to wait before the element appears. Use small steps (0.06 to 0.1) to stagger siblings. */
  delay?: number
  /** Distance the element rises, in pixels. Default 14. */
  y?: number
  /**
   * Appear as soon as the page loads (the top of the page). By default the element appears when
   * it scrolls into view, one time.
   */
  immediate?: boolean
  /** Element to render: `div` (default), or `span` for a line inside a heading. */
  as?: 'div' | 'span'
  className?: string
}

/**
 * Makes its content appear with a short fade and a small rise. Readers who ask for reduced motion
 * get the fade only (see the `MotionConfig` of the landing page), and the page stays readable with
 * no script (see the `noscript` rule in index.html).
 */
export function Reveal({ children, delay = 0, y = 14, immediate = false, as = 'div', className }: RevealProps) {
  const shown = { opacity: 1, y: 0 }
  const Element = as === 'span' ? motion.span : motion.div
  return (
    <Element
      data-reveal=""
      className={className}
      initial={{ opacity: 0, y }}
      {...(immediate ? { animate: shown } : { whileInView: shown, viewport: { once: true, margin: '0px 0px -12% 0px' } })}
      transition={{ duration: 0.7, delay, ease: EASE }}
    >
      {children}
    </Element>
  )
}
