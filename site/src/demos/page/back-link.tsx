import type * as React from 'react'
import { PageBackLink, PageHeader } from 'ferry-ui'

// The demo stays on this page. In an app, give the path to `href` and remove `onClick`.
const stay = (event: React.MouseEvent) => event.preventDefault()

export default function PageBackLinkDemo() {
  return (
    <PageHeader
      eyebrow={
        <PageBackLink href="#" onClick={stay}>
          Projects
        </PageBackLink>
      }
      title="Create a project"
      description="Give the project a name. You can change it later in the settings."
    />
  )
}
