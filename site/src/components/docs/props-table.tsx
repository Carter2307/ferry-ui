import * as React from 'react'
import { Badge, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from 'ferry-ui'

export interface ApiProp {
  name: string
  type: string
  required: boolean
  default: string | null
  description: string
  deprecated: boolean
}

export interface ApiData {
  name: string
  file: string
  description: string
  props: ApiProp[]
}

/** Text with `code` spans: the JSDoc of the sources uses backticks for names and values. */
function InlineDoc({ text }: { text: string }) {
  return (
    <>
      {text.split('`').map((part, index) =>
        index % 2 === 1 ? <code key={index}>{part}</code> : <React.Fragment key={index}>{part}</React.Fragment>,
      )}
    </>
  )
}

export interface PropsTableProps {
  /** Name of the component, as exported by ferry-ui: `Button`, `DialogContent`. */
  of: string
  /** Set by the build from `of`: the props read from the sources (`npm run site:api`). */
  data?: ApiData
}

/**
 * The props of one component: name, type, default value and what the prop does. The data comes
 * from the TypeScript types and the JSDoc of the sources, so the table always matches the code.
 */
export function PropsTable({ of, data }: PropsTableProps) {
  if (!data) return null
  if (data.props.length === 0) {
    return (
      <p>
        <code>{of}</code> has no props of its own. It accepts the attributes of the element it renders.
      </p>
    )
  }
  return (
    <Table aria-label={`Props of ${of}`} className="text-[13px]">
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead className="w-[30%]">Prop</TableHead>
          <TableHead>Type</TableHead>
          <TableHead className="w-[18%]">Default</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.props.map((prop) => (
          <React.Fragment key={prop.name}>
            <TableRow className="border-b-0 hover:bg-transparent">
              <TableCell className="pb-1.5 align-top whitespace-normal">
                <span className="flex flex-wrap items-center gap-1.5">
                  <code className="font-mono text-[12.5px] text-foreground">{prop.name}</code>
                  {prop.required && <Badge variant="info">Required</Badge>}
                  {prop.deprecated && <Badge variant="warning">Deprecated</Badge>}
                </span>
              </TableCell>
              <TableCell className="pb-1.5 align-top font-mono text-[12.5px] break-words whitespace-normal text-foreground-light">
                {prop.type}
              </TableCell>
              <TableCell className="pb-1.5 align-top font-mono text-[12.5px] break-words whitespace-normal text-foreground-light">
                {prop.default ?? <span className="text-foreground-muted">-</span>}
              </TableCell>
            </TableRow>
            <TableRow className="hover:bg-transparent">
              <TableCell colSpan={3} className="pt-0 pb-3 leading-relaxed whitespace-normal text-foreground-light">
                {prop.description ? (
                  prop.description.split('\n\n').map((paragraph, index) => (
                    <p key={index} className={index > 0 ? 'mt-1.5' : undefined}>
                      <InlineDoc text={paragraph} />
                    </p>
                  ))
                ) : (
                  <span className="text-foreground-lighter">See the element or the Radix UI primitive this part renders.</span>
                )}
              </TableCell>
            </TableRow>
          </React.Fragment>
        ))}
      </TableBody>
    </Table>
  )
}
