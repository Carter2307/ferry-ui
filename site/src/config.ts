export const SITE_NAME = 'libui'
export const SITE_TAGLINE = 'a React design system for product interfaces'
export const SITE_DESCRIPTION =
  'libui is a React 19 design system for dashboards, admin consoles and developer tools: tokens, accessible primitives, patterns and the application shell.'

export const VERSION = '0.1.0'
export const GITHUB_URL = 'https://github.com/Carter2307/ferry-ui'
export const LICENSE_URL = `${GITHUB_URL}/blob/main/LICENSE`

/** GitHub page of a file of the repository, e.g. `sourceUrl('src/components/primitives/button.tsx')`. */
export const sourceUrl = (file: string) => `${GITHUB_URL}/blob/main/${file}`

/** First page of the documentation. */
export const DOCS_HOME = '/docs/overview/quick-start'

/**
 * URL of a file the server sends as it is (a Markdown page, llms.txt, an image of `public/`),
 * with the base path of the site in front. Routes of the app do not need it: the router adds
 * the base path itself.
 */
export const withBase = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`
