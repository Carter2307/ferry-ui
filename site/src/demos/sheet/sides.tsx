import { Button, Sheet, SheetBody, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from 'ferry-ui'

const SIDES = ['top', 'right', 'bottom', 'left'] as const

export default function SheetSides() {
  return (
    <>
      {SIDES.map((side) => (
        <Sheet key={side}>
          <SheetTrigger asChild>
            <Button>{side}</Button>
          </SheetTrigger>
          <SheetContent side={side}>
            <SheetHeader>
              <SheetTitle>Side {side}</SheetTitle>
              <SheetDescription>The panel comes from the {side} edge of the screen.</SheetDescription>
            </SheetHeader>
            <SheetBody className="text-[13px] text-foreground-light">The page stays in view behind the panel.</SheetBody>
          </SheetContent>
        </Sheet>
      ))}
    </>
  )
}
