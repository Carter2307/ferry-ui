import { Kbd, MonoLabel, useModKey } from '@roger.b/libui'

export default function KbdHero() {
  const mod = useModKey()

  return (
    <section className="flex w-full max-w-xs flex-col gap-2 text-[13px] text-foreground-light">
      <MonoLabel as="h3">Shortcuts</MonoLabel>
      <p className="flex items-center justify-between">
        Open the command menu <Kbd>{mod} K</Kbd>
      </p>
      <p className="flex items-center justify-between">
        Save the changes <Kbd>{mod} S</Kbd>
      </p>
      <p className="flex items-center justify-between">
        Close a dialog <Kbd>Esc</Kbd>
      </p>
    </section>
  )
}
