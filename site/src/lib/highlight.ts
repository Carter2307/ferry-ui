import { highlight } from 'sugar-high'

const SCRIPT_LANGUAGES = new Set(['js', 'jsx', 'ts', 'tsx', 'javascript', 'typescript'])
const SHELL_LANGUAGES = new Set(['sh', 'bash', 'shell', 'zsh', 'console'])

export const isScript = (language?: string) => language !== undefined && SCRIPT_LANGUAGES.has(language)
export const isShell = (language?: string) => language !== undefined && SHELL_LANGUAGES.has(language)

const escapeHtml = (text: string) => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

/**
 * Code as HTML. JavaScript and TypeScript (with JSX) get token colors from the `--sh-*` variables
 * of site.css; other languages stay plain text.
 */
export function highlightCode(code: string, language?: string): string {
  return isScript(language) ? highlight(code) : escapeHtml(code)
}

/** True when each line of a shell snippet is one command: no comment, no line continued with `\`. */
export function isCommandList(code: string): boolean {
  const lines = code.split('\n').filter((line) => line.trim() !== '')
  return lines.length > 0 && lines.every((line) => !line.trimStart().startsWith('#') && !line.trimEnd().endsWith('\\'))
}
