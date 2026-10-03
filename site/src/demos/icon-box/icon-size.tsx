import { IconBox } from 'libui-kit'
import { Receipt } from 'lucide-react'

export default function IconBoxIconSize() {
  return (
    <>
      <IconBox size="xs">
        <Receipt />
      </IconBox>
      <IconBox size="xs" className="[&_svg]:size-4">
        <Receipt />
      </IconBox>
    </>
  )
}
