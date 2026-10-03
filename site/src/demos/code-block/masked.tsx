import { CodeBlock } from 'ferry-ui'

export default function CodeBlockMasked() {
  return (
    <CodeBlock
      className="max-w-md"
      prompt
      code="export ACME_API_KEY=sk_demo_••••3f6a"
      copyValue="export ACME_API_KEY=sk_demo_4f9a2c7e1b8d3f6a"
      what="command with your API key"
    />
  )
}
