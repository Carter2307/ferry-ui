import { Button, EmptyState } from 'libui-kit'
import { Compass } from 'lucide-react'

import { RouterLink } from '@/components/providers'
import { DOCS_HOME } from '@/config'
import { usePageMeta } from '@/lib/use-page-meta'

export function NotFoundPage() {
  usePageMeta('Page not found')
  return (
    <main className="grid min-h-dvh place-items-center bg-background p-6">
      <EmptyState
        variant="bordered"
        size="lg"
        icon={<Compass />}
        title="This page does not exist"
        description="The address is not correct, or the page has a new address."
        actions={
          <>
            <Button asChild variant="primary">
              <RouterLink href="/">Go to the home page</RouterLink>
            </Button>
            <Button asChild>
              <RouterLink href={DOCS_HOME}>Read the docs</RouterLink>
            </Button>
          </>
        }
      />
    </main>
  )
}
