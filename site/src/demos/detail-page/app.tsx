import { toast } from '@roger.b/libui'

import { DetailPageExample } from '../../../../src/examples/detail-page-example'

export default function DetailPageApp() {
  return (
    <DetailPageExample
      // The example has no router: a real app opens the page of the link here.
      onNavigate={(href) => toast('Navigation', { description: `A real app opens ${href} here.` })}
    />
  )
}
