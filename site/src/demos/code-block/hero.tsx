import { Card, CardContent, CardDescription, CardHeader, CardTitle, CodeBlock } from 'libui'

const SAMPLE = `import { Acme } from '@acme/sdk'

const acme = new Acme(process.env.ACME_API_KEY)
await acme.invoices.create({ customer: 'cus_4QbX2', amount: 4280 })`

export default function CodeBlockHero() {
  return (
    <Card className="w-full max-w-lg">
      <CardHeader>
        <div>
          <CardTitle>Install the SDK</CardTitle>
          <CardDescription>Send your first request to the Invoices API.</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <p className="text-[13px] font-medium text-foreground">Add the package</p>
          <CodeBlock prompt code="npm install @acme/sdk" />
        </div>
        <div className="flex flex-col gap-1.5">
          <p className="text-[13px] font-medium text-foreground">Create an invoice</p>
          <CodeBlock what="code sample" code={SAMPLE} />
        </div>
      </CardContent>
    </Card>
  )
}
