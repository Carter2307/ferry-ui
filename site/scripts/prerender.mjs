// Static pages (`npm run site:build`, last step): renders every route of the site to an HTML file
// in site/dist, so each page works on any static host, shows before the scripts load and can be
// read by a search engine. The browser then hydrates the page and continues as a single-page app.
//
// Input: site/dist/index.html (the client build) and site/.ssr/entry-server.js (the server build).
import fs from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

import { SITE_ROOT } from '../lib/content.mjs'

const dist = path.join(SITE_ROOT, 'dist')
const serverEntry = path.join(SITE_ROOT, '.ssr', 'entry-server.js')
const template = fs.readFileSync(path.join(dist, 'index.html'), 'utf8')

const escapeHtml = (text) => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

const { render, routes } = await import(pathToFileURL(serverEntry).href)

// React reports a render error of a page on the console and keeps going: make it fail the build.
const errors = []
const consoleError = console.error
console.error = (...args) => {
  errors.push(args.map(String).join(' '))
  consoleError(...args)
}

let failed = 0
for (const route of routes) {
  const before = errors.length
  let html = ''
  try {
    html = await render(route.path)
  } catch (error) {
    errors.push(String(error))
    consoleError(error)
  }
  if (errors.length > before) {
    failed += 1
    consoleError(`✗ ${route.path}`)
    continue
  }
  const head = [
    `<title>${escapeHtml(route.title)}</title>`,
    `<meta name="description" content="${escapeHtml(route.description)}" />`,
    `<meta property="og:title" content="${escapeHtml(route.title)}" />`,
    `<meta property="og:description" content="${escapeHtml(route.description)}" />`,
  ].join('\n    ')
  const page = template.replace(/<!--head-->[\s\S]*?<!--\/head-->/, head).replace('<!--app-->', html)
  // `/404` is the file static hosts serve for an unknown address.
  const file = route.path === '/404' ? path.join(dist, '404.html') : path.join(dist, route.path, 'index.html')
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, page)
}

console.error = consoleError
fs.rmSync(path.join(SITE_ROOT, '.ssr'), { recursive: true, force: true })

if (failed > 0) {
  console.error(`prerender: ${failed} of ${routes.length} pages failed to render.`)
  process.exit(1)
}
console.log(`prerender: ${routes.length} pages written to ${path.relative(process.cwd(), dist)}`)
