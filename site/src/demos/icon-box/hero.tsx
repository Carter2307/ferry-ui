import { IconBox } from 'ferry-ui'
import { FolderKanban, KeyRound, Receipt } from 'lucide-react'

const RESULTS = [
  { icon: <FolderKanban />, name: 'Billing portal', kind: 'Project' },
  { icon: <Receipt />, name: 'INV-2041', kind: 'Invoice' },
  { icon: <KeyRound />, name: 'Analytics export', kind: 'API key' },
]

export default function IconBoxHero() {
  return (
    <ul className="w-full max-w-sm divide-y rounded-lg border bg-surface-100">
      {RESULTS.map((result) => (
        <li key={result.name} className="flex items-center gap-3 px-4 py-3">
          <IconBox size="sm">{result.icon}</IconBox>
          <span className="flex min-w-0 flex-col">
            <span className="truncate text-sm text-foreground">{result.name}</span>
            <span className="text-[13px] text-foreground-lighter">{result.kind}</span>
          </span>
        </li>
      ))}
    </ul>
  )
}
