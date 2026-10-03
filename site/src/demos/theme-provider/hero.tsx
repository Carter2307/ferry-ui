import { Button, useTheme } from '@roger.b/libui'
import { Monitor, Moon, Sun } from 'lucide-react'

export default function ThemeProviderHero() {
  // The provider is at the root of the app. The hook changes the preference from any component.
  const { setTheme } = useTheme()
  return (
    <>
      <Button icon={<Sun />} onClick={() => setTheme('light')}>
        Light
      </Button>
      <Button icon={<Moon />} onClick={() => setTheme('dark')}>
        Dark
      </Button>
      <Button icon={<Monitor />} onClick={() => setTheme('system')}>
        System
      </Button>
    </>
  )
}
