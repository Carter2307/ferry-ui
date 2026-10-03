import { DropdownMenuItem, SplitButton } from 'ferry-ui'

const VARIANTS = [
  { variant: 'default', label: 'Default' },
  { variant: 'primary', label: 'Primary' },
  { variant: 'outline', label: 'Outline' },
  { variant: 'destructive', label: 'Destructive' },
  { variant: 'warning', label: 'Warning' },
] as const

export default function SplitButtonVariants() {
  return (
    <>
      {VARIANTS.map(({ variant, label }) => (
        <SplitButton
          key={variant}
          variant={variant}
          menuLabel={`More actions, ${variant}`}
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
