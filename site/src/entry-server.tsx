import { StrictMode } from 'react'
import { prerenderToNodeStream } from 'react-dom/static'
import { StaticRouter } from 'react-router'

import { App } from './app'
import { SITE_DESCRIPTION } from './config'
import { pages } from './lib/nav'
import { pageTitle } from './lib/use-page-meta'

export interface StaticRoute {
  /** URL of the page, without the base path: `/`, `/docs/components/button`. */
  path: string
  title: string
  description: string
}

/** Every page the build writes as a static HTML file. */
export const routes: StaticRoute[] = [
  { path: '/', title: pageTitle(), description: SITE_DESCRIPTION },
  { path: '/docs', title: pageTitle('Documentation'), description: SITE_DESCRIPTION },
  ...pages.map((page) => ({ path: page.path, title: pageTitle(page.title), description: page.description || SITE_DESCRIPTION })),
  { path: '/frame', title: pageTitle('Example'), description: SITE_DESCRIPTION },
  { path: '/404', title: pageTitle('Page not found'), description: SITE_DESCRIPTION },
]

/** The HTML of one page, with its lazy content resolved. */
export async function render(path: string): Promise<string> {
  const basename = import.meta.env.BASE_URL.replace(/\/$/, '')
  const { prelude } = await prerenderToNodeStream(
    <StrictMode>
      <StaticRouter basename={basename} location={`${basename}${path}`}>
        <App />
      </StaticRouter>
    </StrictMode>,
  )
  const chunks: Buffer[] = []
  for await (const chunk of prelude) chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : (chunk as Buffer))
  return Buffer.concat(chunks).toString('utf8')
}
