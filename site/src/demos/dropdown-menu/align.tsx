import { Button, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from 'ferry-ui'

const ALIGNMENTS = ['start', 'center', 'end'] as const

export default function DropdownMenuAlign() {
  return (
    <>
      {ALIGNMENTS.map((align) => (
        <DropdownMenu key={align}>
          <DropdownMenuTrigger asChild>
            <Button>{align}</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align={align} className="w-48">
            <DropdownMenuItem>Open</DropdownMenuItem>
            <DropdownMenuItem>Duplicate</DropdownMenuItem>
            <DropdownMenuItem>Archive</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ))}
    </>
  )
}
