import { Collapsible as CollapsiblePrimitive } from "radix-ui"

/**
 * Unstyled show/hide region driven by one trigger: an "Advanced options"
 * section of a form, a "Show 3 more" list, a sidebar group. Style the trigger
 * and content yourself; `data-state="open" | "closed"` is exposed on both for
 * styling (e.g. rotating a chevron).
 *
 * Control it with `open` + `onOpenChange` or leave it uncontrolled with
 * `defaultOpen`.
 *
 * Not for several mutually exclusive sections (use an accordion), or content
 * that should float over the page (use `Popover` / `DropdownMenu`).
 */
function Collapsible({
  ...props
}: React.ComponentProps<typeof CollapsiblePrimitive.Root>) {
  return <CollapsiblePrimitive.Root data-slot="collapsible" {...props} />
}

/**
 * The button that toggles the `Collapsible` (sets `aria-expanded`). Use
 * `asChild` to make a `Button` or any custom element the trigger.
 */
function CollapsibleTrigger({
  ...props
}: React.ComponentProps<typeof CollapsiblePrimitive.CollapsibleTrigger>) {
  return (
    <CollapsiblePrimitive.CollapsibleTrigger
      data-slot="collapsible-trigger"
      {...props}
    />
  )
}

/**
 * The region shown while the `Collapsible` is open; unmounted when closed
 * unless `forceMount`. Unanimated by default: to slide it, add
 * `overflow-hidden data-[state=open]:animate-collapsible-down
 * data-[state=closed]:animate-collapsible-up` and put any padding on an inner
 * element (the animation runs on this element's height).
 */
function CollapsibleContent({
  ...props
}: React.ComponentProps<typeof CollapsiblePrimitive.CollapsibleContent>) {
  return (
    <CollapsiblePrimitive.CollapsibleContent
      data-slot="collapsible-content"
      {...props}
    />
  )
}

export { Collapsible, CollapsibleTrigger, CollapsibleContent }
