import { Button, Hint } from 'ferry-ui'

const SIDES = ['top', 'right', 'bottom', 'left'] as const

export default function TooltipSide() {
  return (
    <>
      {SIDES.map((side) => (
        <Hint key={side} label={`Tooltip on the ${side}`} side={side}>
          <Button>{side}</Button>
        </Hint>
      ))}
    </>
  )
}
