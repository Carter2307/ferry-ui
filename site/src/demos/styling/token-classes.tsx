const PROJECTS = [
  { id: 'web', name: 'Web app', owner: 'Maya Chen', invoices: 12 },
  { id: 'billing', name: 'Billing portal', owner: 'Sam Lee', invoices: 4 },
  { id: 'docs', name: 'Help center', owner: 'Maya Chen', invoices: 0 },
]

export default function TokenClasses() {
  return (
    <ul className="w-full max-w-sm divide-y rounded-lg border bg-surface-100">
      {PROJECTS.map((project) => (
        <li key={project.id} className="flex items-center justify-between gap-3 px-4 py-3">
          <div className="min-w-0">
            <p className="truncate text-sm text-foreground">{project.name}</p>
            <p className="truncate text-[13px] text-foreground-light">Owner: {project.owner}</p>
          </div>
          <span className="tabular text-[13px] text-foreground-lighter">{project.invoices} invoices</span>
        </li>
      ))}
    </ul>
  )
}
