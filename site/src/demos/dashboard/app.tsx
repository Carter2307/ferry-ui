import { toast } from 'libui-kit'

import { DashboardExample } from '../../../../src/examples/dashboard-example'

export default function DashboardApp() {
  return (
    <DashboardExample
      // The example has no router: a real app opens the page of the link here.
      onNavigate={(href) => toast('Navigation', { description: `A real app opens ${href} here.` })}
      onCreateProject={() => toast('New project', { description: 'Open your create dialog here.' })}
    />
  )
}
