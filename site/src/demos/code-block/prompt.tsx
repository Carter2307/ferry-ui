import { CodeBlock } from 'libui'

const SETUP = `git clone https://example.com/acme/web-app.git
cd web-app

npm install
npm run dev`

export default function CodeBlockPromptProp() {
  return (
    <div className="flex w-full max-w-md flex-col gap-3">
      <CodeBlock prompt code="npx acme login" />
      <CodeBlock prompt code={SETUP} what="setup commands" />
      <CodeBlock prompt="sql>" code="SELECT id, total FROM invoices;" what="query" />
    </div>
  )
}
