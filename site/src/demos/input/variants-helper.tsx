import * as React from 'react'
import { Input, Label, inputVariants } from 'libui-kit'

const SEAT_PRICE = 20

export default function InputVariantsHelper() {
  const [seats, setSeats] = React.useState('12')
  const total = (Number(seats) || 0) * SEAT_PRICE

  return (
    <div className="flex w-full max-w-sm flex-col gap-2">
      <Label htmlFor="plan-seats">Seats</Label>
      <div className="flex gap-2">
        <Input
          id="plan-seats"
          type="number"
          size="sm"
          min={1}
          className="w-24"
          value={seats}
          onChange={(event) => setSeats(event.target.value)}
        />
        <output
          htmlFor="plan-seats"
          aria-label="Monthly total"
          className={inputVariants({ size: 'sm', mono: true, className: 'flex items-center' })}
        >
          ${total}.00 / month
        </output>
      </div>
    </div>
  )
}
