import { toast } from 'libui'

import { SettingsExample } from '../../../../src/examples/settings-example'

export default function SettingsApp() {
  return (
    <SettingsExample
      // The example has no router: a real app opens the page of the link here.
      onNavigate={(href) => toast('Navigation', { description: `A real app opens ${href} here.` })}
    />
  )
}
