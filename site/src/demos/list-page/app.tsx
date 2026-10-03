import { toast } from 'ferry-ui'

import { ListPageExample } from '../../../../src/examples/list-page-example'

export default function ListPageApp() {
  return (
    <ListPageExample
      // The example has no router: a real app opens the page of the link here.
      onNavigate={(href) => toast('Navigation', { description: `A real app opens ${href} here.` })}
      onCreateProject={() => toast('New project', { description: 'Open your create dialog here.' })}
    />
  )
}
