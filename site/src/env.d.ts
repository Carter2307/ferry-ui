/// <reference types="vite/client" />

declare module 'virtual:docs-nav' {
  export interface DocHeading {
    depth: 2 | 3
    text: string
    id: string
  }

  export interface DocPage {
    /** URL of the page, e.g. `/docs/components/button`. */
    path: string
    /** Folder under `content/`, e.g. `components`. */
    section: string
    /** File name without extension. */
    slug: string
    /** Path relative to `src/content`, e.g. `components/button.mdx`. */
    file: string
    title: string
    description: string
    /** Sidebar group: one of `groups`. */
    group: string
    order: number | null
    /** Repository path of the documented module (the "View source" link). */
    source: string | null
    headings: DocHeading[]
  }

  /** Sidebar groups, in display order. */
  export const groups: string[]
  /** Every page, in sidebar order. */
  export const pages: DocPage[]
}
