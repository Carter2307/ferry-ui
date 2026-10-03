import { ThemeMenu } from 'ferry-ui'

export default function ThemeMenuAlign() {
  return (
    <>
      <ThemeMenu align="start" tooltip={false} />
      <ThemeMenu align="center" tooltip={false} />
      <ThemeMenu align="end" tooltip={false} />
    </>
  )
}
