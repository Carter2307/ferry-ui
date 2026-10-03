import type * as React from 'react'
import { Button, PageBackLink, PageHeader, StatusBadge } from 'libui-kit'
import { Download } from 'lucide-react'

// The demo stays on this page. In an app, give the path to `href` and remove `onClick`.
const stay = (event: React.MouseEvent) => event.preventDefault()

export default function PageHeaderLarge() {
  return (
    <PageHeader
      size="lg"
      eyebrow={
        <PageBackLink href="#" onClick={stay}>
          Customers
        </PageBackLink>
      }
      title="Acme"
      description="Customer since March 2024. 42 seats."
      badges={<StatusBadge tone="success" label="Active" size="sm" />}
      actions={<Button icon={<Download />}>Export</Button>}
    />
  )
}
