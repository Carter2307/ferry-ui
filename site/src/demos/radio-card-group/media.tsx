import { RadioCard, RadioCardGroup } from 'libui-kit'

// A small drawing of a page layout, made with token classes.
function Preview({ sidebar = false }: { sidebar?: boolean }) {
  return (
    <span className="flex h-20 w-full gap-1.5 bg-surface-200 p-2">
      {sidebar && <span className="w-1/4 rounded-sm bg-surface-300" />}
      <span className="flex flex-1 flex-col gap-1.5">
        {!sidebar && <span className="h-2.5 rounded-sm bg-surface-300" />}
        <span className="flex-1 rounded-sm border bg-background" />
      </span>
    </span>
  )
}

export default function RadioCardGroupMedia() {
  return (
    <RadioCardGroup
      aria-label="Dashboard layout"
      indicator="radio"
      defaultValue="sidebar"
      className="mx-auto w-full max-w-md grid-cols-2"
    >
      <RadioCard
        value="sidebar"
        label="Sidebar"
        description="The navigation is on the left."
        media={<Preview sidebar />}
      />
      <RadioCard
        value="top-bar"
        label="Top bar"
        description="The navigation is above the content."
        media={<Preview />}
      />
    </RadioCardGroup>
  )
}
