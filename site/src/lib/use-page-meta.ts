import * as React from 'react'

import { SITE_DESCRIPTION, SITE_NAME, SITE_TAGLINE } from '@/config'

/** The `<title>` text of a page of the site. */
export const pageTitle = (title?: string) => (title ? `${title} · ${SITE_NAME}` : `${SITE_NAME}: ${SITE_TAGLINE}`)

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
