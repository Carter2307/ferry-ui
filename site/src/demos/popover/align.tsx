import { Button, Popover, PopoverContent, PopoverTrigger } from 'libui-kit'

const ALIGNMENTS = ['start', 'center', 'end'] as const

export default function PopoverAlign() {
  return (
    <>
      {ALIGNMENTS.map((align) => (
        <Popover key={align}>
          <PopoverTrigger asChild>
            <Button>{align}</Button>
          </PopoverTrigger>
          <PopoverContent align={align} aria-label={`Alignment ${align}`} className="w-56 text-[13px] text-foreground-light">
            The panel aligns to the {align} of the trigger.
          </PopoverContent>
        </Popover>
      ))}
    </>
  )
}
