import * as React from 'react'

import { cn } from "../../lib/utils"

/**
 * Bordered panel: 8px radius, `card` surface, hairline border and a barely-there shadow
 * (none in dark mode). Use it to group one topic of a page — a settings form, a list,
 * a summary. Compose it with `CardHeader` / `CardContent` / `CardFooter`, each of which
 * brings its own padding and dividers; content with its own edge-to-edge layout (a table)
 * can go directly inside. Avoid nesting cards inside cards.
 */
function Card({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card"
      className={cn(
        'flex flex-col overflow-hidden rounded-lg border bg-card text-card-foreground shadow-card',
        className,
      )}
      {...props}
    />
  )
}

/**
 * Top bar of a `Card`: at least 48px high, bottom border, content laid out in a row with
 * space between — typically a title block on the left and a `CardAction` on the right.
 * Wrap `CardTitle` + `CardDescription` in a `<div>` to stack them.
 */
function CardHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        'flex min-h-12 items-center justify-between gap-3 border-b px-5 py-3 md:px-6',
        className,
      )}
      {...props}
    />
  )
}

/**
 * Card heading (14px, medium weight). Rendered as a `<div>`: put an `<h2>`/`<h3>` inside
 * when the page outline needs a real heading.
 */
function CardTitle({ className, ...props }: React.ComponentProps<'div'>) {
  return <div data-slot="card-title" className={cn('text-sm font-medium text-foreground', className)} {...props} />
}

/** Secondary line under a `CardTitle` (13px, lighter foreground). Keep it to one short sentence. */
function CardDescription({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div data-slot="card-description" className={cn('text-[13px] text-foreground-light', className)} {...props} />
  )
}

/** Right-aligned slot in a `CardHeader` for compact controls: a small button, a menu, a badge. */
function CardAction({ className, ...props }: React.ComponentProps<'div'>) {
  return <div data-slot="card-action" className={cn('flex shrink-0 items-center gap-2', className)} {...props} />
}

/**
 * Padded body of a `Card`: 20px horizontal (24px from `md`, aligned with the header and footer)
 * and 16px vertical padding. Omit it when the content should touch the card edges (a table, a list).
 */
function CardContent({ className, ...props }: React.ComponentProps<'div'>) {
  return <div data-slot="card-content" className={cn('px-5 py-4 md:px-6', className)} {...props} />
}

/**
 * Bottom bar of a `Card`: top border, actions aligned right. Use it for the submit /
 * cancel buttons of a form card or a "View all" link; add `justify-between` to put helper
 * text on the left.
 */
function CardFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-footer"
      className={cn('flex items-center justify-end gap-2 border-t px-5 py-3 md:px-6', className)}
      {...props}
    />
  )
}

export { Card, CardHeader, CardFooter, CardTitle, CardAction, CardDescription, CardContent }
