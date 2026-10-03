export default function ElevationTokens() {
  return (
    <div className="grid w-full gap-6 sm:grid-cols-2">
      <div className="flex flex-col gap-1 rounded-lg border bg-surface-100 p-4 font-mono shadow-card">
        <span className="text-[13px] text-foreground">shadow-card</span>
        <span className="text-xs text-foreground-lighter">--shadow-card</span>
      </div>
      <div className="flex flex-col gap-1 rounded-lg border border-border-strong bg-surface-300 p-4 font-mono shadow-overlay">
        <span className="text-[13px] text-foreground">shadow-overlay</span>
        <span className="text-xs text-foreground-lighter">--shadow-overlay</span>
      </div>
    </div>
  )
}
