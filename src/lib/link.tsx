import * as React from 'react'

/**
 * Props every libui link receives. Router adapters must forward them all
 * (className, aria-current, onClick, target, rel…) to the rendered anchor.
 */
export type LinkComponentProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  /** Destination, as a plain string (map it to your router's `to` / `href`). */
  href: string
  /** Content of the link (text, icons…). Render it inside the anchor as-is. */
  children?: React.ReactNode
}

/**
 * A component that renders a navigation link — a plain <a> or a router adapter
 * (`({ href, ...props }) => <RouterLink to={href} {...props} />`). Define it once at
 * module level (not inside a component) so it stays stable between renders.
 */
export type LinkComponent = React.ComponentType<LinkComponentProps>

function DefaultLink(props: LinkComponentProps) {
  return <a {...props} />
}

const LinkContext = React.createContext<LinkComponent>(DefaultLink)

/** Props of {@link LinkProvider}. */
export interface LinkProviderProps {
  /**
   * The link to render for every libui link below (a router adapter). Must forward all props to an
   * anchor. Define it at module level so it keeps the same identity between renders.
   */
  component: LinkComponent
  /** The part of the app whose libui links go through `component` (usually the whole app). */
  children?: React.ReactNode
}

/**
 * Makes every libui component that renders a link (navigation items, cards,
 * breadcrumbs, command items…) go through your router instead of a plain <a>,
 * so clicks become client-side navigations. Mount it once near the app root.
 *
 * Not needed in apps without a client-side router (plain anchors are the default),
 * and not meant for your own links: use your router's link directly there.
 * A component's `linkComponent` prop overrides the provider for that component.
 *
 * ```tsx
 * // react-router
 * const RouterLink: LinkComponent = ({ href, ...props }) => <Link to={href} {...props} />
 * // Next.js
 * const RouterLink: LinkComponent = ({ href, ...props }) => <NextLink href={href} {...props} />
 *
 * <LinkProvider component={RouterLink}><App /></LinkProvider>
 * ```
 */
export function LinkProvider({ component, children }: LinkProviderProps) {
  return <LinkContext.Provider value={component}>{children}</LinkContext.Provider>
}

/**
 * Resolves the link component to render: `override` (a component's own
 * `linkComponent` prop) if given, else the nearest <LinkProvider>'s, else a plain <a>.
 * For authors of components that render links:
 * `const Link = useLinkComponent(props.linkComponent)` then `<Link href="…" />`.
 */
export function useLinkComponent(override?: LinkComponent): LinkComponent {
  const fromContext = React.useContext(LinkContext)
  return override ?? fromContext
}
