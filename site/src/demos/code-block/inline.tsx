import { CodeBlock } from '@roger.b/libui'

const PLACEHOLDERS = [
  { code: '{{customer.first_name}}', help: 'The first name of the customer.' },
  { code: '{{invoice.total}}', help: 'The total of the invoice, with its currency.' },
  { code: '{{workspace.portal_url}}', help: 'The link to the billing portal of the workspace.' },
]

export default function CodeBlockInline() {
  return (
    <div className="w-full max-w-sm divide-y rounded-lg border">
      {PLACEHOLDERS.map((placeholder) => (
        <div key={placeholder.code} className="flex flex-col gap-1.5 px-4 py-3">
          <CodeBlock variant="inline" code={placeholder.code} what="placeholder" />
          <p className="text-[13px] text-foreground-light">{placeholder.help}</p>
        </div>
      ))}
    </div>
  )
}
