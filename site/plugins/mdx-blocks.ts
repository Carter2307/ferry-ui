import fs from 'node:fs'
import path from 'node:path'

import { parse } from 'acorn'

import { API_DIR, DEMOS_DIR, REPO_ROOT } from '../lib/content.mjs'

/* -------------------------------------------------------------------------------------------------
 * Minimal tree types (mdast + MDX JSX, hast): only what these plugins read and write.
 * -----------------------------------------------------------------------------------------------*/

interface MdxAttribute {
  type: string
  name?: string
  value?: unknown
}

interface TreeNode {
  type: string
  name?: string | null
  tagName?: string
  attributes?: MdxAttribute[]
  children?: TreeNode[]
  properties?: Record<string, unknown>
  data?: { meta?: string | null; estree?: unknown }
  value?: string
}

interface VFileLike {
  path?: string
  fail(reason: string, place?: unknown): never
}

function walk(node: TreeNode, visit: (node: TreeNode) => void) {
  visit(node)
  for (const child of node.children ?? []) walk(child, visit)
}

const program = (code: string) => parse(code, { ecmaVersion: 'latest', sourceType: 'module' })

/** `name={identifier}` as an MDX JSX attribute. */
function expressionAttribute(name: string, identifier: string): MdxAttribute {
  return {
    type: 'mdxJsxAttribute',
    name,
    value: { type: 'mdxJsxAttributeValueExpression', value: identifier, data: { estree: program(identifier) } },
  }
}

function stringAttribute(node: TreeNode, name: string): string | undefined {
  const attribute = node.attributes?.find((a) => a.type === 'mdxJsxAttribute' && a.name === name)
  return typeof attribute?.value === 'string' ? attribute.value : undefined
}

const hasAttribute = (node: TreeNode, name: string) =>
  node.attributes?.some((a) => a.type === 'mdxJsxAttribute' && a.name === name) ?? false

/**
 * Wires the two data-driven blocks of a page to their files, so a page only names them:
 *
 * - `<Demo name="button/variants" />` imports `src/demos/button/variants.tsx` twice: as the live
 *   component and as raw text (the code shown under it). With `frame`, the demo runs in an iframe
 *   (a real viewport, for layout components) and only the text is imported. `code="src/…"` shows
 *   another file of the repository instead of the demo file.
 * - `<PropsTable of="Button" />` imports `src/generated/api/Button.json` (written by
 *   `npm run site:api` from the component's types and JSDoc).
 *
 * A name with no file stops the build with the page and the missing path.
 */
export function remarkDocsBlocks() {
  return (tree: TreeNode, file: VFileLike) => {
    const imports: string[] = []
    let count = 0

    walk(tree, (node) => {
      if (node.type !== 'mdxJsxFlowElement' && node.type !== 'mdxJsxTextElement') return

      if (node.name === 'Demo') {
        const name = stringAttribute(node, 'name')
        if (!name) file.fail('<Demo> needs a name, for example <Demo name="button/variants" />', node)
        const demoFile = path.join(DEMOS_DIR, `${name}.tsx`)
        if (!fs.existsSync(demoFile)) file.fail(`<Demo name="${name}">: no file src/demos/${name}.tsx`, node)

        const codePath = stringAttribute(node, 'code')
        const codeFile = codePath ? path.join(REPO_ROOT, codePath) : demoFile
        if (!fs.existsSync(codeFile)) file.fail(`<Demo code="${codePath}">: no such file in the repository`, node)

        const id = count++
        node.attributes = (node.attributes ?? []).filter((a) => a.name !== 'code')
        imports.push(`import __demoSource${id} from ${JSON.stringify(`${codeFile}?raw`)}`)
        node.attributes.push(expressionAttribute('source', `__demoSource${id}`))
        if (!hasAttribute(node, 'frame')) {
          imports.push(`import __demo${id} from ${JSON.stringify(demoFile)}`)
          node.attributes.push(expressionAttribute('component', `__demo${id}`))
        }
      }

      if (node.name === 'PropsTable') {
        const of = stringAttribute(node, 'of')
        if (!of) file.fail('<PropsTable> needs a component, for example <PropsTable of="Button" />', node)
        const apiFile = path.join(API_DIR, `${of}.json`)
        if (!fs.existsSync(apiFile)) {
          file.fail(`<PropsTable of="${of}">: no generated API for this name (run "npm run site:api")`, node)
        }
        const id = count++
        imports.push(`import __api${id} from ${JSON.stringify(apiFile)}`)
        node.attributes = [...(node.attributes ?? []), expressionAttribute('data', `__api${id}`)]
      }
    })

    if (imports.length > 0) {
      const code = imports.join('\n')
      tree.children = [{ type: 'mdxjsEsm', value: code, data: { estree: program(code) } }, ...(tree.children ?? [])]
    }
  }
}

/**
 * Copies the info string of a fenced code block onto its `<pre>`: ```` ```tsx title="app.tsx" ````
 * gives `data-language="tsx"` and `data-meta='title="app.tsx"'`, which the `pre` component reads.
 */
export function rehypeCodeMeta() {
  return (tree: TreeNode) => {
    walk(tree, (node) => {
      if (node.type !== 'element' || node.tagName !== 'pre') return
      const code = node.children?.find((child) => child.type === 'element' && child.tagName === 'code')
      if (!code) return
      const classes = code.properties?.className
      const language = (Array.isArray(classes) ? classes : [])
        .map(String)
        .find((name) => name.startsWith('language-'))
        ?.slice('language-'.length)
      node.properties = {
        ...node.properties,
        ...(language && { 'data-language': language }),
        ...(code.data?.meta && { 'data-meta': code.data.meta }),
      }
    })
  }
}
