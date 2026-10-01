import * as React from 'react'

import { cn } from '../../lib/utils'

/** Elements a {@link MonoLabel} can render as. Pick the one that matches the label's semantics. */
export type MonoLabelElement = 'span' | 'div' | 'p' | 'h2' | 'h3' | 'h4' | 'dt' | 'th' | 'legend' | 'label'

/** Props of {@link MonoLabel}: every global HTML attribute, plus the few element-specific ones it supports. */
export type MonoLabelProps = React.HTMLAttributes<HTMLElement> & {
  /**
   * Element to render. Defaults to `span`. Use `h2`/`h3` for section and menu-group headings,
   * `dt` inside description lists, `th` in hand-built tables (the Table primitive's `TableHead`
   * already has this look), `legend` inside a `fieldset`, `label` (with `htmlFor`) for form fields.
   */
  as?: MonoLabelElement
  /** Id of the form control this label describes. Only meaningful with `as="label"`. */
  htmlFor?: string
  /** Cells this header describes (`col`, `row`…). Only meaningful with `as="th"`. */
  scope?: string
  /** Ref to the rendered element. */
  ref?: React.Ref<HTMLElement>
}

/**
 * The library's signature label: small, UPPERCASE, monospace, muted (11.5px, 0.06em tracking).
 *
 * Use it for card titles, metric and tile labels, column headers, menu-group headings and
 * key/value captions. Do NOT use it for body text, long sentences or primary page headings: it is
 * meant for 1–4 word captions. Change the rendered element with `as` to keep the semantics right.
 * Override the color with a `text-*` class when needed (it defaults to `foreground-lighter`).
 */
export function MonoLabel({ className, as = 'span', ref, ...props }: MonoLabelProps) {
  // Every allowed element accepts these props; the cast only narrows the union for JSX.
  const Comp = as as 'span'
  return (
    <Comp
      ref={ref as React.Ref<HTMLSpanElement>}
      data-slot="mono-label"
      className={cn('mono-label', className)}
      {...props}
    />
  )
}
