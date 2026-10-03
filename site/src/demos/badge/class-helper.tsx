import { badgeVariants } from '@roger.b/libui'

const TAGS = ['Design', 'Frontend', 'Roadmap', 'Customer request']

export default function BadgeClassHelper() {
  return (
    <ul aria-label="Tags" className="flex flex-wrap gap-1.5">
      {TAGS.map((tag) => (
        <li key={tag} className={badgeVariants({ variant: 'outline', case: 'normal' })}>
          {tag}
        </li>
      ))}
    </ul>
  )
}
