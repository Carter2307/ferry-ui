import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
  toast,
} from 'libui-kit'
import { ChevronDown, FolderInput, Pencil } from 'lucide-react'

const TEAMS = ['Marketing', 'Product', 'Finance']

export default function DropdownMenuSubmenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button iconRight={<ChevronDown />}>Document</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-48">
        <DropdownMenuItem onSelect={() => toast('Rename the document')}>
          <Pencil /> Rename
        </DropdownMenuItem>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <FolderInput /> Move to
          </DropdownMenuSubTrigger>
          {/* The portal makes sure that the first panel does not cut the submenu. */}
          <DropdownMenuPortal>
            <DropdownMenuSubContent className="w-40">
              {TEAMS.map((team) => (
                <DropdownMenuItem key={team} onSelect={() => toast.success(`Document moved to ${team}`)}>
                  {team}
                </DropdownMenuItem>
              ))}
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
