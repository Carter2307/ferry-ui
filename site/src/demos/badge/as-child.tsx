import { Badge } from 'libui-kit'

export default function BadgeAsChild() {
  return (
    <Badge asChild variant="outline" case="normal">
      <a
        href="https://github.com/Carter2307/libui"
        target="_blank"
        rel="noreferrer"
        className="hover:bg-surface-200 hover:text-foreground"
      >
        Source code
      </a>
    </Badge>
  )
}
