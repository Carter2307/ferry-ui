import { Badge } from 'libui-kit'

const PLAN = 'Enterprise annual plan with priority support'

export default function BadgeLongText() {
  return (
    <div className="flex w-64 rounded-lg border bg-surface-100 p-3">
      {/* The badge takes the width of its parent at most. The full text stays in `title`. */}
      <Badge variant="outline" case="normal" className="max-w-full justify-start" title={PLAN}>
        <span className="truncate">{PLAN}</span>
      </Badge>
    </div>
  )
}
