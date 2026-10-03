// Markdown versions of the pages ("View as Markdown") and the llms.txt index. A reader, or an AI
// assistant, gets the same content as the page with the live blocks written out: a demo becomes
// its source code, a props table becomes a Markdown table.
import fs from 'node:fs'
import path from 'node:path'

import { API_DIR, CONTENT_DIR, DEMOS_DIR, GROUPS, REPO_ROOT, parseFrontmatter, readPages } from './content.mjs'

/** Managers shown by `<PackageTabs>`, with the command each one uses to add a package. */
export const PACKAGE_MANAGERS = [
  { id: 'npm', install: 'npm install' },
  { id: 'pnpm', install: 'pnpm add' },
  { id: 'yarn', install: 'yarn add' },
  { id: 'bun', install: 'bun add' },
]

const attribute = (tag, name) => new RegExp(`\\b${name}=(?:"([^"]*)"|'([^']*)')`).exec(tag)?.slice(1).find(Boolean)

const cell = (text) => String(text).replace(/\|/g, '\\|').replace(/\s*\n+\s*/g, ' ')

function propsTable(name) {
  const file = path.join(API_DIR, `${name}.json`)
  if (!fs.existsSync(file)) return `_No generated API for ${name}._`
  const api = JSON.parse(fs.readFileSync(file, 'utf8'))
  if (api.props.length === 0) return `\`${name}\` has no props of its own. It accepts the attributes of the element it renders.`
  const rows = api.props.map(
    (prop) =>
      `| \`${prop.name}\`${prop.required ? ' (required)' : ''} | \`${cell(prop.type)}\` | ${prop.default === null ? '' : `\`${cell(prop.default)}\``} | ${cell(prop.description)} |`,
  )
  return ['| Prop | Type | Default | Description |', '| --- | --- | --- | --- |', ...rows].join('\n')
}

function demoSource(tag) {
  const name = attribute(tag, 'name')
  const code = attribute(tag, 'code')
  const file = code ? path.join(REPO_ROOT, code) : path.join(DEMOS_DIR, `${name}.tsx`)
  if (!fs.existsSync(file)) return ''
  return `\`\`\`tsx\n${fs.readFileSync(file, 'utf8').trimEnd()}\n\`\`\``
}

function packageTabs(tag) {
  const packages = attribute(tag, 'packages') ?? ''
  return `\`\`\`sh\n${PACKAGE_MANAGERS.map((manager) => `${manager.install} ${packages}`).join('\n')}\n\`\`\``
}

/**
 * The Markdown version of one page.
 * @param {import('./content.mjs').DocPage} page
 */
export function pageMarkdown(page) {
  const { body } = parseFrontmatter(fs.readFileSync(path.join(CONTENT_DIR, page.file), 'utf8'))
  const content = body
    .replace(/^(import|export)\s.*$/gm, '')
    .replace(/<Demo\b[^>]*\/>/g, demoSource)
    .replace(/<PropsTable\b[^>]*\/>/g, (tag) => propsTable(attribute(tag, 'of')))
    .replace(/<PackageTabs\b[^>]*\/>/g, packageTabs)
    .replace(/\n{3,}/g, '\n\n')
    .trim()
  return `# ${page.title}\n\n${page.description}\n\n${content}\n`
}

/**
 * The llms.txt index: every page with its one-sentence description, grouped like the sidebar.
 * @param {string} base Public base path of the site, with a trailing slash (`/` or `/libui/`).
 */
export function llmsText(base) {
  const pages = readPages()
  const lines = [
    '# libui',
    '',
    '> libui is a React 19 design system for product interfaces (dashboards, admin consoles, settings pages, data tables, developer tools): design tokens, accessible primitives on Radix UI, patterns and application-shell layout pieces, styled with Tailwind CSS v4.',
    '',
    "Import everything from the package root (`import { Button } from 'libui-kit'`). Each link below is the Markdown version of a documentation page.",
  ]
  for (const group of GROUPS) {
    const inGroup = pages.filter((page) => page.group === group)
    if (inGroup.length === 0) continue
    lines.push('', `## ${group}`, '')
    for (const page of inGroup) {
      lines.push(`- [${page.title}](${base}${page.path.slice(1)}.md)${page.description ? `: ${page.description}` : ''}`)
    }
  }
  return lines.join('\n') + '\n'
}

export { readPages }
