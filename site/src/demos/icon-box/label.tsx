import { IconBox } from 'libui'
import { Database, KeyRound } from 'lucide-react'

export default function IconBoxLabel() {
  return (
    <div className="flex flex-col gap-3 text-sm text-foreground">
      {/* The name is next to the box: the box is decorative. */}
      <div className="flex items-center gap-3">
        <IconBox size="sm">
          <Database />
        </IconBox>
        Database
      </div>
      {/* No type name is next to the box: the label gives it to screen readers. */}
      <div className="flex items-center gap-3">
        <IconBox size="sm" label="API key">
          <KeyRound />
        </IconBox>
        <span className="font-mono text-[13px]">sk_test_07be</span>
      </div>
    </div>
  )
}
