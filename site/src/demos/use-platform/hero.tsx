import { Kbd, useModKey } from 'libui'

export default function UsePlatformHero() {
  // "⌘" on an Apple device, "Ctrl" on other devices.
  const mod = useModKey()
  return (
    <p className="flex items-center gap-2 text-sm text-foreground-light">
      Open the command menu <Kbd>{mod} K</Kbd>
    </p>
  )
}
