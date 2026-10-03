import { Button, Popover, PopoverContent, PopoverTrigger } from '@roger.b/libui'

const SIDES = ['top', 'right', 'bottom', 'left'] as const

export default function PopoverSide() {
  return (
    <>
      {SIDES.map((side) => (
        <Popover key={side}>
          <PopoverTrigger asChild>
            <Button>{side}</Button>
          </PopoverTrigger>
          <PopoverContent side={side} aria-label={`Side ${side}`} className="w-48 text-[13px] text-foreground-light">
            The panel opens on the {side} side of the trigger.
          </PopoverContent>
        </Popover>
      ))}
    </>
  )
}
