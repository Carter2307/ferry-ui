import type * as React from 'react'

/** One navigation destination, shared by IconRail, InnerMenu, MobileNav and CommandMenu. */
export interface NavItem {
  /** Stable key. */
  id: string
  /** Visible text and accessible name of the destination. */
  label: string
  /** 16px line icon (e.g. a lucide-react element). */
  icon?: React.ReactNode
  /** Destination; rendered through the configured link component (see LinkProvider). */
  href?: string
  /** Called on selection (instead of, or in addition to, `href`). */
  onSelect?: () => void
  /** Marks the current location (`aria-current="page"`). */
  active?: boolean
  /**
   * Opens in a new tab and shows an external-link affordance. An external item skips the configured
   * link component: it renders a plain `<a target="_blank" rel="noreferrer">`.
   */
  external?: boolean
  /** Trailing adornment (count, "New" badge…). */
  badge?: React.ReactNode
  /** Shown dimmed and not selectable. */
  disabled?: boolean
}

/** A titled group of navigation items. */
export interface NavGroup {
  /** Stable key, unique among the groups. */
  id: string
  /** Optional group heading (rendered as a mono label). */
  label?: string
  /** Destinations of the group, in display order. */
  items: NavItem[]
}
