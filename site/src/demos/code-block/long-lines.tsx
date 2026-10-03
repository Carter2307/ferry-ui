import { CodeBlock } from 'libui-kit'

const REQUEST =
  'curl -X POST https://api.example.com/v2/invoices -H "Authorization: Bearer $ACME_API_KEY" -d customer=cus_4QbX2'

export default function CodeBlockLongLines() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-3">
      <CodeBlock code={REQUEST} what="request" />
      <CodeBlock code={REQUEST} what="request" copyPlacement="side" />
      <CodeBlock code={REQUEST} what="request" wrap />
    </div>
  )
}
