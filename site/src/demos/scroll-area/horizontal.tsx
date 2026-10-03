import { ScrollArea, ScrollBar } from 'libui-kit'

const PROJECTS = [
  { name: 'Marketing site', tasks: 14 },
  { name: 'Billing portal', tasks: 8 },
  { name: 'Mobile app', tasks: 23 },
  { name: 'Design system', tasks: 5 },
  { name: 'Help center', tasks: 11 },
  { name: 'Partner API', tasks: 9 },
]

export default function ScrollAreaHorizontal() {
  return (
    <ScrollArea
      type="always"
      className="w-full max-w-md rounded-lg border whitespace-nowrap"
      viewportProps={{ tabIndex: 0, role: 'region', 'aria-label': 'Projects' }}
    >
      {/* w-max: the row keeps the width of its items, wider than the area. */}
      <div className="flex w-max gap-3 p-4">
        {PROJECTS.map((project) => (
          <div key={project.name} className="w-40 shrink-0 rounded-lg border bg-surface-100 p-3">
            <div className="truncate text-sm font-medium text-foreground">{project.name}</div>
            <div className="mt-1 text-xs text-foreground-lighter">
              <span className="tabular">{project.tasks}</span> open tasks
            </div>
          </div>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  )
}
