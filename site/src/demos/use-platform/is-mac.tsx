import { Kbd, useIsMac } from 'libui'

export default function UsePlatformIsMac() {
  const isMac = useIsMac()
  return (
    <p className="flex items-center gap-2 text-sm text-foreground-light">
      Delete the selected rows
      {/* The two platforms use different keys for this action. */}
      {isMac ? <Kbd>⌘ ⌫</Kbd> : <Kbd>Del</Kbd>}
    </p>
  )
}
