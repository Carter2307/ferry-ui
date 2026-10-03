import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  toast,
} from 'libui-kit'
import { Archive, ChevronDown, Copy, Pencil, Share2 } from 'lucide-react'

export default function DropdownMenuHero() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button iconRight={<ChevronDown />}>Actions</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-48">
        <DropdownMenuLabel>Project</DropdownMenuLabel>
        <DropdownMenuItem onSelect={() => toast('Edit the project')}>
          <Pencil /> Edit
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => toast.success('Project duplicated')}>
          <Copy /> Duplicate
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => toast('Share the project')}>
          <Share2 /> Share
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={() => toast.success('Project archived')}>
          <Archive /> Archive
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
