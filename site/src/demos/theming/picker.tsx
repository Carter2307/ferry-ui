import * as React from 'react'
import { ToggleGroup, ToggleGroupItem, useTheme, type ThemePreference } from 'libui-kit'

const isPreference = (value: string): value is ThemePreference =>
  value === 'light' || value === 'dark' || value === 'system'

const subscribe = () => () => {}

export default function ThemePicker() {
  const { theme, resolvedTheme, setTheme } = useTheme()
  // A server does not know the stored preference: show it after the first render in the browser.
  const mounted = React.useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  )

  return (
    <div className="flex flex-col items-center gap-3">
      <ToggleGroup
        type="single"
        variant="outline"
        aria-label="Theme"
        value={mounted ? theme : ''}
        onValueChange={(next) => {
          // Single mode sends "" when the active item gets a click: keep one item selected.
          if (isPreference(next)) setTheme(next)
        }}
      >
        <ToggleGroupItem value="light">Light</ToggleGroupItem>
        <ToggleGroupItem value="dark">Dark</ToggleGroupItem>
        <ToggleGroupItem value="system">System</ToggleGroupItem>
      </ToggleGroup>
      <p className="text-[13px] text-foreground-light">
        The page shows the <span className="text-foreground">{mounted ? resolvedTheme : 'light'}</span> theme.
      </p>
    </div>
  )
}
