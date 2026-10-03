import { Kbd } from 'libui'

const KEYS = ['⌘', '⇧', '⌥', 'Ctrl', 'Esc', 'Tab', '↵', '↑', '↓', '/', 'Backspace']

export default function KbdKeys() {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {KEYS.map((key) => (
        <Kbd key={key}>{key}</Kbd>
      ))}
    </div>
  )
}
