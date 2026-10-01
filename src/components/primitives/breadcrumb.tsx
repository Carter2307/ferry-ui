import * as React from "react"
import { cn } from "../../lib/utils"
import { ChevronRight, MoreHorizontal } from "lucide-react"
import { Slot } from "radix-ui"

import { useLinkComponent, type LinkComponent } from "../../lib/link"

/**
 * Shows where the current page sits in a hierarchy (Workspace > Projects >
 * Website redesign) and links back to each ancestor. Renders a
 * `<nav aria-label="breadcrumb">`; compose it from `BreadcrumbList`,
 * `BreadcrumbItem`, `BreadcrumbLink` / `BreadcrumbPage` and
 * `BreadcrumbSeparator`.
 *
 * Not for step-by-step flows (use a stepper) or for a single "Back" link.
 */
function Breadcrumb({ ...props }: React.ComponentProps<"nav">) {
  return <nav aria-label="breadcrumb" data-slot="breadcrumb" {...props} />
}

/** The ordered list of crumbs: muted 14px text that wraps on small screens. */
function BreadcrumbList({ className, ...props }: React.ComponentProps<"ol">) {
  return (
    <ol
      data-slot="breadcrumb-list"
      className={cn(
        "flex flex-wrap items-center gap-1.5 text-sm break-words text-muted-foreground sm:gap-2.5",
        className
      )}
      {...props}
    />
  )
}

/** One crumb: wraps a `BreadcrumbLink`, a `BreadcrumbPage` or a `BreadcrumbEllipsis`. */
function BreadcrumbItem({ className, ...props }: React.ComponentProps<"li">) {
  return (
    <li
      data-slot="breadcrumb-item"
      className={cn("inline-flex items-center gap-1.5", className)}
      {...props}
    />
  )
}

/** Props of {@link BreadcrumbLink}: every native `<a>` prop plus the options below. */
type BreadcrumbLinkProps = React.ComponentProps<"a"> & {
  /**
   * Merge the crumb styles onto the single child element (e.g. a router link
   * you render yourself) instead of rendering a link. `linkComponent` is ignored.
   */
  asChild?: boolean
  /**
   * Link component for this crumb only, overriding the one from the nearest
   * `LinkProvider` (a plain `<a>` by default). Usually you set a `LinkProvider`
   * once at the app root instead.
   */
  linkComponent?: LinkComponent
}

/**
 * A clickable ancestor crumb (muted, foreground on hover, focus ring on
 * keyboard focus like every interactive primitive). With an `href` it
 * renders through the libui link contract: the component from the nearest
 * `LinkProvider` (a plain `<a>` by default) or the `linkComponent` prop, so
 * crumbs use your router without extra wiring. Without an `href` it renders a
 * bare `<a>`. Pass `asChild` to style an element you render yourself instead.
 *
 * Not for the current page: use `BreadcrumbPage`.
 */
function BreadcrumbLink({
  asChild,
  linkComponent,
  className,
  ...props
}: BreadcrumbLinkProps) {
  const Link = useLinkComponent(linkComponent)
  const cls = cn(
    "-mx-1 rounded-sm px-1 transition-colors outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring",
    className
  )

  if (asChild) {
    return <Slot.Root data-slot="breadcrumb-link" className={cls} {...props} />
  }
  if (props.href === undefined) {
    return <a data-slot="breadcrumb-link" className={cls} {...props} />
  }
  return (
    // `Link` comes from props/context (useLinkComponent): stable, not created during render.
    // eslint-disable-next-line react-hooks/static-components
    <Link data-slot="breadcrumb-link" className={cls} {...props} href={props.href} />
  )
}

/**
 * The current page: the last crumb, in foreground color, not clickable
 * (`aria-current="page"`). Use exactly one per breadcrumb.
 */
function BreadcrumbPage({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="breadcrumb-page"
      role="link"
      aria-disabled="true"
      aria-current="page"
      className={cn("font-normal text-foreground", className)}
      {...props}
    />
  )
}

/**
 * The divider between two items, hidden from assistive tech. Renders a
 * chevron by default; pass children (e.g. a `/` or `<Slash />`) to replace it.
 */
function BreadcrumbSeparator({
  children,
  className,
  ...props
}: React.ComponentProps<"li">) {
  return (
    <li
      data-slot="breadcrumb-separator"
      role="presentation"
      aria-hidden="true"
      className={cn("[&>svg]:size-3.5", className)}
      {...props}
    >
      {children ?? <ChevronRight />}
    </li>
  )
}

/**
 * A "…" placeholder for collapsed middle crumbs in deep hierarchies. Wrap it
 * in a `DropdownMenuTrigger` to reveal the hidden levels. It is hidden from
 * assistive tech, so give that trigger its own `aria-label`.
 */
function BreadcrumbEllipsis({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="breadcrumb-ellipsis"
      role="presentation"
      aria-hidden="true"
      className={cn("flex size-9 items-center justify-center", className)}
      {...props}
    >
      <MoreHorizontal className="size-4" />
    </span>
  )
}

export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
  type BreadcrumbLinkProps,
}
