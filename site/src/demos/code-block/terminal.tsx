import { CodeBlock, CodeBlockPrompt } from 'libui'

export default function CodeBlockTerminal() {
  return (
    <CodeBlock variant="terminal" className="w-full max-w-md">
      <CodeBlockPrompt />
      npm run test
      {'\n'}
      <span className="text-success">✓ invoices.test.ts (12 tests)</span>
      {'\n'}
      <span className="text-success">✓ customers.test.ts (8 tests)</span>
      {'\n'}
      <span className="text-warning">! 1 snapshot is obsolete</span>
    </CodeBlock>
  )
}
