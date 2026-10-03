import { ScrollArea, Separator } from 'libui'

const VERSIONS = Array.from({ length: 24 }, (_, index) => `v2.${24 - index}.0`)

export default function ScrollAreaAlways() {
  return (
    <ScrollArea
      type="always"
      className="h-56 w-56 rounded-lg border bg-surface-100"
      viewportProps={{ tabIndex: 0, role: 'region', 'aria-label': 'Releases' }}
    >
      <div className="p-4">
        <div className="mb-3 mono-label">Releases</div>
        {VERSIONS.map((version) => (
          <div key={version}>
            <div className="py-1.5 font-mono text-[13px] text-foreground-light">{version}</div>
            <Separator />
          </div>
        ))}
      </div>
    </ScrollArea>
  )
}
