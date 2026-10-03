import type { Plugin } from 'vite'

import { llmsText, pageMarkdown, readPages } from '../lib/markdown.mjs'

/**
 * Serves the Markdown version of every page (`/docs/components/button.md`, the "View as Markdown"
 * link) and `/llms.txt`: from memory in development, as files of the build in production.
 */
export function markdownPages(): Plugin {
  let base = '/'
  return {
    name: 'ferry-ui-site:markdown-pages',
    configResolved(config) {
      base = config.base
    },
    configureServer(server) {
      server.middlewares.use((request, response, next) => {
        const url = (request.url ?? '').split('?')[0] ?? ''
        if (!url.startsWith(base)) return next()
        const path = `/${url.slice(base.length)}`
        const send = (text: string, type: string) => {
          response.setHeader('Content-Type', `${type}; charset=utf-8`)
          response.end(text)
        }
        if (path === '/llms.txt') return send(llmsText(base), 'text/plain')
        if (path.startsWith('/docs/') && path.endsWith('.md')) {
          const page = readPages().find((candidate) => `${candidate.path}.md` === path)
          if (page) return send(pageMarkdown(page), 'text/markdown')
        }
        next()
      })
    },
    generateBundle(options) {
      // Once, with the client build (the server build has no public files).
      if (options.dir?.endsWith('.ssr')) return
      for (const page of readPages()) {
        this.emitFile({ type: 'asset', fileName: `${page.path.slice(1)}.md`, source: pageMarkdown(page) })
      }
      this.emitFile({ type: 'asset', fileName: 'llms.txt', source: llmsText(base) })
    },
  }
}
