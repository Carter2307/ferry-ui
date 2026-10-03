import { CommandMenu, type CommandMenuGroup } from 'libui'

import { pagesByGroup } from '@/lib/nav'

/** Every page of the documentation, found by its title or by a word of its description. */
const SEARCH_GROUPS: CommandMenuGroup[] = pagesByGroup.map(({ group, pages }) => ({
  id: group,
  label: group,
  items: pages.map((page) => ({
    id: page.path,
    label: page.title,
    href: page.path,
    value: `${group} ${page.title}`,
    keywords: page.description.split(/\s+/).filter((word) => word.length > 3),
  })),
}))

/** The search of the site: libui's `CommandMenu` over the pages of the documentation. */
export function SiteSearch({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  return (
    <CommandMenu
      open={open}
      onOpenChange={onOpenChange}
      groups={SEARCH_GROUPS}
      title="Search the documentation"
      placeholder="Search the docs…"
      emptyMessage="No page found."
    />
  )
}
