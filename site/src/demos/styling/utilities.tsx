const REGIONS = ['eu-west', 'eu-central', 'us-east', 'us-west', 'ap-south', 'ap-northeast', 'sa-east']

export default function Utilities() {
  return (
    <div className="grid w-full max-w-lg gap-x-8 gap-y-6 sm:grid-cols-2">
      <div className="flex flex-col gap-2">
        <code className="text-xs text-foreground-lighter">mono-label</code>
        <span className="mono-label">Monthly revenue</span>
      </div>
      <div className="flex flex-col gap-2">
        <code className="text-xs text-foreground-lighter">tabular</code>
        <div className="tabular w-24 text-right text-sm text-foreground">
          <p>1,111.10</p>
          <p>9,876.54</p>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <code className="text-xs text-foreground-lighter">bg-dot-grid</code>
        <div className="bg-dot-grid h-16 rounded-lg border" />
      </div>
      <div className="flex min-w-0 flex-col gap-2">
        <code className="text-xs text-foreground-lighter">scrollbar-none</code>
        {/* The list scrolls sideways with a trackpad, a touch screen or the arrow keys. */}
        <div
          tabIndex={0}
          role="region"
          aria-label="Regions"
          className="scrollbar-none overflow-x-auto rounded-md outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <ul className="flex gap-2">
            {REGIONS.map((region) => (
              <li key={region} className="shrink-0 rounded-sm border bg-surface-100 px-2 py-1 font-mono text-xs text-foreground-light">
                {region}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
