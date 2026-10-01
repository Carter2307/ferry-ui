import type * as React from 'react'

/** Clicks landing on (or inside) these elements keep their own behavior and never open the row. */
const INTERACTIVE_SELECTOR = [
  'a',
  'button',
  'input',
  'select',
  'textarea',
  'label',
  '[role=button]',
  '[role=link]',
  '[role=checkbox]',
  '[role=switch]',
  '[role=menuitem]',
  '[role=menuitemcheckbox]',
  '[role=menuitemradio]',
].join(',')

/**
 * Makes a whole table row clickable: returns `className` (pointer cursor) and
 * `onClick` props to spread on a `<TableRow>`.
 *
 * ```tsx
 * <TableRow {...rowLinkProps(() => navigate(`/projects/${id}`))}>
 *   <TableCell><Link href={`/projects/${id}`}>{name}</Link></TableCell>
 *   …
 * </TableRow>
 * ```
 *
 * The row does NOT open when the click:
 * - lands on an interactive descendant (link, button, input, checkbox, menu item…);
 * - bubbles up through a React portal from content rendered elsewhere in the
 *   DOM (row menus, dialogs opened from the row);
 * - was already handled (`event.preventDefault()`, e.g. by a router link) —
 *   calling `preventDefault()` or `stopPropagation()` is also how a custom
 *   descendant opts out;
 * - ends a text selection (the user is selecting a value to copy).
 *
 * The row click is a pointer convenience only: always keep a real link in the
 * first cell. It gives the row its accessible name and is what keyboard and
 * screen-reader users (and cmd/ctrl-click "open in new tab") rely on.
 *
 * Do NOT use it when rows have no single destination (use a selection
 * checkbox or explicit action buttons instead). A `className` written after
 * the spread replaces the returned `cursor-pointer`: merge them with `cn()`
 * when the row needs its own classes.
 *
 * @param onOpen Called with the click event when the row itself is clicked
 *   (read `event.metaKey` / `event.ctrlKey` to open in a new tab).
 */
export function rowLinkProps(onOpen: (event: React.MouseEvent<HTMLTableRowElement>) => void): {
  className: string
  onClick: React.MouseEventHandler<HTMLTableRowElement>
} {
  return {
    className: 'cursor-pointer',
    onClick: (event) => {
      if (event.defaultPrevented) return
      const target = event.target as Element
      // Events from portaled content (menus, dialogs) bubble through the React tree, not the DOM one.
      if (!event.currentTarget.contains(target)) return
      if (target.closest(INTERACTIVE_SELECTOR)) return
      if (window.getSelection()?.toString()) return
      onOpen(event)
    },
  }
}
