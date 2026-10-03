import type * as React from 'react'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  Button,
  PageHeader,
  StatusBadge,
} from 'libui'
import { Download } from 'lucide-react'

// The demo stays on this page. In an app, give the path to `href` and remove `onClick`.
const stay = (event: React.MouseEvent) => event.preventDefault()

export default function BreadcrumbPageHeader() {
  return (
    <PageHeader
      title="Invoice INV-2041"
      badges={<StatusBadge tone="success" label="Paid" size="sm" />}
      actions={<Button icon={<Download />}>Download PDF</Button>}
      eyebrow={
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="#" onClick={stay}>
                Billing
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="#" onClick={stay}>
                Invoices
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>INV-2041</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      }
    />
  )
}
