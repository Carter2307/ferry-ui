import type { MDXContent } from 'mdx/types'
import { groups, pages, type DocPage } from 'virtual:docs-nav'

export { groups, pages, type DocPage }

/** `/docs/components/button/` and `/docs/components/button` are the same page. */
export const normalizePath = (pathname: string) => (pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname)

const byPath = new Map(pages.map((page) => [page.path, page]))

export function findPage(pathname: string): DocPage | undefined {
  return byPath.get(normalizePath(pathname))
}

/** The pages before and after a page, in sidebar order. */
export function neighbors(page: DocPage): { previous?: DocPage; next?: DocPage } {
  const index = pages.indexOf(page)
  return { previous: pages[index - 1], next: pages[index + 1] }
}

/** The pages of each sidebar group, in display order (empty groups are left out). */
export const pagesByGroup = groups
  .map((group) => ({ group, pages: pages.filter((page) => page.group === group) }))
  .filter((entry) => entry.pages.length > 0)

/* -------------------------------------------------------------------------------------------------
 * Page content: one chunk per page, loaded when the page opens.
 * -----------------------------------------------------------------------------------------------*/

const loaders = import.meta.glob<{ default: MDXContent }>('../content/**/*.mdx')

/** A promise React can read with no delay after it settles (the `status` / `value` fields `use()` looks at). */
type TrackedPromise<T> = Promise<T> & { status?: 'pending' | 'fulfilled' | 'rejected'; value?: T; reason?: unknown }

const loading = new Map<string, TrackedPromise<MDXContent>>()

/**
 * Loads the content of a page (`file` is `DocPage.file`). The same promise is returned each time,
 * so a component reads it with `use()`: it suspends while the chunk loads, and renders at once
 * when the chunk is already there.
 */
export function loadPage(file: string): Promise<MDXContent> {
  let promise = loading.get(file)
  if (!promise) {
    const loader = loaders[`../content/${file}`]
    const tracked: TrackedPromise<MDXContent> = loader
      ? loader().then((module) => module.default)
      : Promise.reject(new Error(`No content for ${file}`))
    tracked.status = 'pending'
    tracked.then(
      (value) => {
        tracked.status = 'fulfilled'
        tracked.value = value
      },
      (reason: unknown) => {
        tracked.status = 'rejected'
        tracked.reason = reason
      },
    )
    promise = tracked
    loading.set(file, promise)
  }
  return promise
}

/** Loads the page of a URL ahead of its render: before hydration, or when a link gets the pointer. */
export function preloadPath(pathname: string): Promise<unknown> {
  const page = findPage(pathname)
  return page ? loadPage(page.file).catch(() => undefined) : Promise.resolve()
}
