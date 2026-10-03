import { CopyButton, SecretField, type CopyLabels } from 'ferry-ui'

// Module level: all the copy components of the app use this object. An entry that you leave out keeps its default.
const LABELS: Partial<CopyLabels> = {
  copy: 'Duplicate',
  copied: 'Done',
  copyWhat: (what) => `Duplicate ${what}`,
  reveal: 'Show',
  hide: 'Mask',
  revealWhat: (what) => `Show ${what ?? 'value'}`,
  hideWhat: (what) => `Mask ${what ?? 'value'}`,
}

export default function CopyLabelsDemo() {
  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-3">
      <div className="flex items-center gap-2">
        <span className="font-mono text-[13px] text-foreground">INV-2026-0142</span>
        <CopyButton value="INV-2026-0142" what="invoice number" variant="ghost" labels={LABELS} />
      </div>
      <SecretField value="sk_demo_4f9a2c7e1b8d3f6a" what="secret key" aria-label="Secret key" labels={LABELS} />
    </div>
  )
}
