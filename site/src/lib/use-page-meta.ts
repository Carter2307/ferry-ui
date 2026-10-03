import * as React from 'react'

import { SITE_DESCRIPTION, SITE_NAME, SITE_TAGLINE } from '@/config'

/** The `<title>` text of a page of the site. */
export const pageTitle = (title?: string) => {
  if (!title) return `${SITE_NAME}: ${SITE_TAGLINE}`
  // "About ferry-ui" already has the name: do not write it a second time.
  return title.includes(SITE_NAME) ? title : `${title} · ${SITE_NAME}`
}

/**
 * Sets the document title and description after a client-side navigation. The first HTML of each
 * page already has them (scripts/prerender.mjs writes them from the same data).
 */
export function usePageMeta(title?: string, description: string = SITE_DESCRIPTION) {
  React.useEffect(() => {
    document.title = pageTitle(title)
    document.querySelector('meta[name="description"]')?.setAttribute('content', description)
  }, [title, description])
}
