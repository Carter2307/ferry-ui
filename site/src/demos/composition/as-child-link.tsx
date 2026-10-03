import { Button } from 'libui-kit'
import { ExternalLink } from 'lucide-react'

export default function AsChildLink() {
  return (
    // The Button gives its look to the link. The page gets an <a>, not a <button>.
    <Button asChild iconRight={<ExternalLink />}>
      <a href="https://github.com/Carter2307/libui" target="_blank" rel="noreferrer">
        Open the repository
      </a>
    </Button>
  )
}
