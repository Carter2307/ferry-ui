import type * as React from 'react'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from 'libui-kit'

// The demo stays on this page. In an app, give the path to `href` and remove `onClick`.
const stay = (event: React.MouseEvent) => event.preventDefault()

export default function BreadcrumbLong() {
  return (
    <Breadcrumb className="w-full max-w-xs">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="#" onClick={stay}>
            Acme
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="#" onClick={stay} className="max-w-32 truncate" title="Customer reviews of the quarter">
            Customer reviews of the quarter
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage className="max-w-40 truncate" title="Review of the third quarter with Acme">
            Review of the third quarter with Acme
          </BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  )
}
