import type { ComponentProps } from 'react'
import type { MDXComponents } from 'mdx/types'
import {
  Badge,
  Callout,
  Kbd,
  Separator,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  cn,
} from 'ferry-ui'

import { RouterLink } from '@/components/providers'

import { Code, PackageTabs, Pre } from './code'
import { Demo } from './demo'
import { PropsTable } from './props-table'

/** A heading that links to itself, so a reader can copy the address of a section. */
function heading(Tag: 'h2' | 'h3') {
  return function Heading({ id, children, ...props }: ComponentProps<'h2'>) {
    return (
      <Tag id={id} {...props}>
        {children}
        {id && (
          <a href={`#${id}`} data-slot="heading-anchor" className="heading-anchor" aria-label="Link to this section">
            #
          </a>
        )}
      </Tag>
    )
  }
}

/** Links of the prose: a page of the site goes through the router, another site opens a new tab. */
function ProseLink({ href = '', children, ...props }: ComponentProps<'a'>) {
  const external = /^https?:\/\//.test(href)
  return (
    <RouterLink href={href} {...(external && { target: '_blank', rel: 'noreferrer' })} {...props}>
      {children}
    </RouterLink>
  )
}

/**
 * What a page can use with no import: Markdown elements rendered with libui components, and the
 * blocks of the documentation (`Demo`, `PropsTable`, `PackageTabs`, `Callout`, `Kbd`, `Badge`).
 */
export const mdxComponents: MDXComponents = {
  h2: heading('h2'),
  h3: heading('h3'),
  a: ProseLink,
  pre: Pre,
  hr: () => <Separator />,
  table: ({ className, ...props }: ComponentProps<'table'>) => <Table className={cn('text-[13.5px]', className)} {...props} />,
  thead: (props: ComponentProps<'thead'>) => <TableHeader {...props} />,
  tbody: (props: ComponentProps<'tbody'>) => <TableBody {...props} />,
  tr: ({ className, ...props }: ComponentProps<'tr'>) => <TableRow className={cn('hover:bg-transparent', className)} {...props} />,
  th: ({ className, align: _align, ...props }: ComponentProps<'th'>) => <TableHead className={className} {...props} />,
  td: ({ className, align: _align, ...props }: ComponentProps<'td'>) => (
    <TableCell className={cn('align-top leading-relaxed whitespace-normal text-foreground-light', className)} {...props} />
  ),
  Demo,
  PropsTable,
  PackageTabs,
  Code,
  Callout,
  Kbd,
  Badge,
}
