import { composeStories } from '@storybook/react-vite'
import { describe, expect, it } from 'vitest'

// Smoke test: every story of every component renders (and its play function passes).
// Narrow the run with a comma-separated path filter:
//   STORIES=primitives/button,patterns/empty-state npx vitest run src/stories.test.tsx
type StoriesModule = Parameters<typeof composeStories>[0]
type ComposedStory = { run: () => Promise<void> }

const loaders = import.meta.glob<StoriesModule>('./**/*.stories.tsx')
const filters = (process.env.STORIES ?? '').split(',').map((s) => s.trim()).filter(Boolean)
const selected = Object.entries(loaders).filter(([path]) => !filters.length || filters.some((f) => path.includes(f)))
const modules = await Promise.all(selected.map(async ([path, load]) => [path, await load()] as const))

describe('stories', () => {
  it('found story files', () => {
    expect(modules.length).toBeGreaterThan(0)
  })
})

for (const [path, mod] of modules) {
  describe(path.replace('./', ''), () => {
    for (const [name, Story] of Object.entries(composeStories(mod)) as [string, ComposedStory][]) {
      it(`${name} renders`, async () => {
        await Story.run()
      })
    }
  })
}
