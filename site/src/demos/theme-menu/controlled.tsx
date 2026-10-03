import * as React from 'react'
import { ThemeMenu, type ThemePreference } from '@roger.b/libui'

export default function ThemeMenuControlled() {
  // Your code holds the preference. The menu does not change the ThemeProvider.
  const [preference, setPreference] = React.useState<ThemePreference>('system')

  return (
    <>
      <ThemeMenu value={preference} onValueChange={setPreference} />
      <span className="text-[13px] text-foreground-light">Preference: {preference}</span>
    </>
  )
}
