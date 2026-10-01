// Copies the distributable stylesheets (tokens, Tailwind theme, fonts) to dist/styles.
import { cpSync, mkdirSync } from 'node:fs'

mkdirSync('dist/styles', { recursive: true })
for (const file of ['tokens.css', 'theme.css', 'fonts.css']) {
  cpSync(`src/styles/${file}`, `dist/styles/${file}`)
}
