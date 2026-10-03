import { Button } from '@roger.b/libui'
import { ExternalLink } from 'lucide-react'

export default function ButtonAsChild() {
  return (
    <Button asChild iconRight={<ExternalLink />}>
      <a href="https://github.com/Carter2307/libui" target="_blank" rel="noreferrer">
        Open the repository
      </a>
    </Button>
  )
}
