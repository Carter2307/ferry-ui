import { Kbd } from 'ferry-ui'

export default function KbdChord() {
  return (
    <ul className="flex w-full max-w-xs flex-col gap-2 text-[13px] text-foreground-light">
      <li className="flex items-center justify-between">
        One keycap for each key
        <span className="flex gap-1">
          <Kbd>⇧</Kbd>
          <Kbd>N</Kbd>
        </span>
      </li>
      <li className="flex items-center justify-between">
        One keycap for all the keys
        <Kbd>⇧ N</Kbd>
      </li>
    </ul>
  )
}
