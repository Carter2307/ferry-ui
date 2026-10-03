import { CodeBlock, CodeBlockPrompt } from 'ferry-ui'

export default function CodeBlockRich() {
  return (
    <CodeBlock className="max-w-md" copyValue="acme invoices list --status overdue" what="command">
      <CodeBlockPrompt />
      acme invoices list <span className="text-primary">--status</span> overdue
    </CodeBlock>
  )
}
