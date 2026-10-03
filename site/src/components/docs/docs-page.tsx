import * as React from 'react'
import { Button, EmptyState, Skeleton, cn } from 'ferry-ui'
import { ArrowLeft, ArrowRight, FileQuestion, FileText } from 'lucide-react'
import { useLocation } from 'react-router'

import { GithubIcon } from '@/components/logo'
import { RouterLink } from '@/components/providers'
import { DOCS_HOME, SITE_NAME, sourceUrl, withBase } from '@/config'
import { findPage, loadPage, neighbors, type DocPage } from '@/lib/nav'
import { usePageMeta } from '@/lib/use-page-meta'

import { mdxComponents } from './mdx-components'

/** The content of a page. It suspends while the chunk of the page loads. */
function PageContent({ file }: { file: string }) {
  const Content = React.use(loadPage(file))
  // The promise of a page always gives the same component: it is not a new one on each render.
  // eslint-disable-next-line react-hooks/static-components
  return <Content components={mdxComponents} />
}

function PageSkeleton() {
  return (
    <div className="flex flex-col gap-4" aria-busy="true" aria-label="Loading the page">
      <Skeleton className="h-44 w-full rounded-lg" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-2/3" />
      <Skeleton className="h-4 w-1/2" />
    </div>
  )
}

/** "On this page": the sections of the page, with the one in view marked. */
function TableOfContents({ page }: { page: DocPage }) {
  const [active, setActive] = React.useState<string | null>(null)

  React.useEffect(() => {
    const root = document.querySelector('[data-slot="docs-scroller"]')
    const targets = page.headings
      .map((heading) => document.getElementById(heading.id))
      .filter((element): element is HTMLElement => element !== null)
    if (!root || targets.length === 0) return
    // The section in view is the last heading that passed the top quarter of the scroller.
    const visible = new Set<string>()
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target.id)
          else visible.delete(entry.target.id)
        }
        const first = page.headings.find((heading) => visible.has(heading.id))
        if (first) setActive(first.id)
      },
      { root, rootMargin: '0px 0px -70% 0px' },
    )
    for (const target of targets) observer.observe(target)
    return () => observer.disconnect()
  }, [page])

  if (page.headings.length < 2) return null
  return (
    <nav aria-label="On this page" className="sticky top-0 max-h-[calc(100dvh-3rem)] overflow-y-auto py-10 pr-6 text-[13px]">
      <p className="mb-2 font-medium text-foreground">On this page</p>
      <ul className="flex flex-col gap-1.5 border-l">
        {page.headings.map((heading) => (
          <li key={heading.id}>
            <a
              href={`#${heading.id}`}
              aria-current={active === heading.id ? 'location' : undefined}
              className={cn(
                '-ml-px block border-l border-transparent py-0.5 text-foreground-lighter transition-colors hover:text-foreground aria-[current]:border-foreground aria-[current]:text-foreground',
                heading.depth === 2 ? 'pl-3' : 'pl-6',
              )}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}

/** Previous and next page, in sidebar order. */
function Pager({ page }: { page: DocPage }) {
  const { previous, next } = neighbors(page)
  if (!previous && !next) return null
  return (
    <nav aria-label="Pages" className="mt-14 grid gap-3 border-t pt-6 sm:grid-cols-2">
      {previous ? (
        <RouterLink
          href={previous.path}
          className="group flex flex-col gap-1 rounded-lg border p-4 transition-colors outline-none hover:border-border-stronger hover:bg-surface-75 focus-visible:ring-2 focus-visible:ring-ring"
        >
          <span className="flex items-center gap-1.5 text-[13px] text-foreground-lighter">
            <ArrowLeft className="size-3.5" aria-hidden="true" /> Previous
          </span>
          <span className="text-[15px] font-medium text-foreground">{previous.title}</span>
        </RouterLink>
      ) : (
        <span className="max-sm:hidden" />
      )}
      {next && (
        <RouterLink
          href={next.path}
          className="group flex flex-col items-end gap-1 rounded-lg border p-4 text-right transition-colors outline-none hover:border-border-stronger hover:bg-surface-75 focus-visible:ring-2 focus-visible:ring-ring"
        >
          <span className="flex items-center gap-1.5 text-[13px] text-foreground-lighter">
            Next <ArrowRight className="size-3.5" aria-hidden="true" />
          </span>
          <span className="text-[15px] font-medium text-foreground">{next.title}</span>
        </RouterLink>
      )}
    </nav>
  )
}

function MissingPage() {
  usePageMeta('Page not found')
  return (
    <div className="mx-auto w-full max-w-2xl px-6 py-20">
      <EmptyState
        variant="bordered"
        size="lg"
        icon={<FileQuestion />}
        title="This page does not exist"
        description="The address is not correct, or the page has a new address. Use the search to find it."
        actions={
          <Button asChild variant="primary">
            <RouterLink href={DOCS_HOME}>Open the quick start</RouterLink>
          </Button>
        }
      />
    </div>
  )
}

/** One documentation page: title, description, links to the Markdown and the source, the content. */
export function DocsPage() {
  const { pathname } = useLocation()
  const page = findPage(pathname)
  if (!page) return <MissingPage />
  return <DocsArticle key={page.path} page={page} />
}

function DocsArticle({ page }: { page: DocPage }) {
  usePageMeta(page.title, page.description)
  return (
    <div className="mx-auto grid w-full max-w-[72rem] xl:grid-cols-[minmax(0,1fr)_15rem]">
      <article className="mx-auto w-full max-w-[47rem] min-w-0 px-5 py-10 sm:px-8 md:py-12">
        <header className="mb-8">
          <p className="mb-2 text-[13px] text-foreground-lighter">{page.group}</p>
          <h1 className="text-[1.875rem] leading-tight font-medium tracking-tight text-foreground sm:text-[2.125rem]">
            {page.title}
          </h1>
          {page.description && <p className="mt-2.5 text-[17px] leading-relaxed text-foreground-light">{page.description}</p>}
          <div className="mt-4 flex flex-wrap gap-x-1 gap-y-1">
            <Button asChild variant="ghost" size="tiny" icon={<FileText />} className="-ml-2">
              <a href={withBase(`${page.path}.md`)}>View as Markdown</a>
            </Button>
            {page.source && (
              <Button asChild variant="ghost" size="tiny" icon={<GithubIcon className="size-3.5" />}>
                <a href={sourceUrl(page.source)} target="_blank" rel="noreferrer">
                  View source
                </a>
              </Button>
            )}
          </div>
        </header>
        <div className="docs-prose">
          <React.Suspense fallback={<PageSkeleton />}>
            <PageContent file={page.file} />
          </React.Suspense>
        </div>
        <Pager page={page} />
        <footer className="mt-10 text-[13px] text-foreground-lighter">
          {SITE_NAME} is open source under the MIT license.
        </footer>
      </article>
      <aside className="max-xl:hidden">
        <TableOfContents page={page} />
      </aside>
    </div>
  )
}
