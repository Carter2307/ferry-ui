import { Toggle } from '@roger.b/libui'

export default function ToggleSizes() {
  return (
    <>
      <Toggle variant="outline" size="tiny">
        Tiny, 26px
      </Toggle>
      <Toggle variant="outline" size="sm">
        Small, 30px
      </Toggle>
      <Toggle variant="outline" size="md">
        Medium, 34px
      </Toggle>
    </>
  )
}
