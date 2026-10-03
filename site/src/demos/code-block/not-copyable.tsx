import { CodeBlock } from 'libui-kit'

const OUTPUT = `Invoice INV-2041 has the status "paid".
Amount: $4,280.00`

export default function CodeBlockNotCopyable() {
  return <CodeBlock className="max-w-md" code={OUTPUT} copyable={false} />
}
