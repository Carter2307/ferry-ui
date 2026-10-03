import type { Plugin } from 'vite'

import { CONTENT_DIR, GROUPS, readPages } from '../lib/content.mjs'

const VIRTUAL_ID = 'virtual:docs-nav'
const RESOLVED_ID = `\0${VIRTUAL_ID}`

/**
 * `virtual:docs-nav`: the list of documentation pages (URL, title, description, sidebar group,
 * headings), read from the front matter of `src/content/**\/*.mdx`. The sidebar, the search, the
 * "on this page" list and the previous / next links all come from it, so a new page only needs
 * its `.mdx` file.
 */
export function docsNav(): Plugin {
  let last = ''
  const code = () => {
    last = JSON.stringify(readPages())
    return `export const groups = ${JSON.stringify(GROUPS)}\nexport const pages = ${last}\n`
  }
  return {
    name: 'libui-site:docs-nav',
    resolveId(id) {
      return id === VIRTUAL_ID ? RESOLVED_ID : undefined
    },
    load(id) {
      return id === RESOLVED_ID ? code() : undefined
    },
    configureServer(server) {
      const refresh = (file: string) => {
        if (!file.startsWith(CONTENT_DIR) || !file.endsWith('.mdx')) return
        // Only a change of the navigation data (a new page, a title, a heading) reloads the app.
        if (JSON.stringify(readPages()) === last) return
        const module = server.moduleGraph.getModuleById(RESOLVED_ID)
        if (module) server.moduleGraph.invalidateModule(module)
        server.ws.send({ type: 'full-reload' })
      }
      server.watcher.on('add', refresh).on('unlink', refresh).on('change', refresh)
    },
  }
}
