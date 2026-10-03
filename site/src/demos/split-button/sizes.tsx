import { DropdownMenuItem, SplitButton } from 'libui'

const SIZES = [
  { size: 'tiny', label: 'Tiny' },
  { size: 'sm', label: 'Small' },
  { size: 'md', label: 'Medium' },
  { size: 'lg', label: 'Large' },
] as const

export default function SplitButtonSizes() {
  return (
    <>
      {SIZES.map(({ size, label }) => (
        <SplitButton
          key={size}
          size={size}
          menuLabel={`More actions, ${size}`}
          menu={
            <>
              <DropdownMenuItem>First alternative</DropdownMenuItem>
              <DropdownMenuItem>Second alternative</DropdownMenuItem>
            </>
          }
        >
          {label}
        </SplitButton>
      ))}
    </>
  )
}
