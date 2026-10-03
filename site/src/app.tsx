import * as React from 'react'
import { Route, Routes, useNavigate } from 'react-router'

import { DocsLayout } from '@/components/docs/docs-layout'
import { DocsPage } from '@/components/docs/docs-page'
import { Providers } from '@/components/providers'
import { DOCS_HOME } from '@/config'
import { FramePage } from '@/pages/frame'
import { LandingPage } from '@/pages/landing'
import { NotFoundPage } from '@/pages/not-found'

/** `/docs` has no page of its own: it opens the first page of the documentation. */
function DocsHome() {
  const navigate = useNavigate()
  React.useEffect(() => {
    void navigate(DOCS_HOME, { replace: true })
  }, [navigate])
  return null
}

/** The site: the landing page, the documentation and the frame that runs full-screen demos. */
export function App() {
  return (
    <Providers>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/docs" element={<DocsLayout />}>
          <Route index element={<DocsHome />} />
          <Route path="*" element={<DocsPage />} />
        </Route>
        <Route path="/frame" element={<FramePage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Providers>
  )
}
