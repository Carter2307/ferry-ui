import { FilterMenu, type FilterOption } from '@roger.b/libui'

const PLAN_OPTIONS: FilterOption[] = [
  { value: 'free', label: 'Free' },
  { value: 'pro', label: 'Pro' },
  { value: 'enterprise', label: 'Enterprise' },
]

export default function FilterMenuTexts() {
  return (
    <FilterMenu
      label="Plan"
      options={PLAN_OPTIONS}
      defaultValue={['pro']}
      heading="Show the customers on"
      clearLabel="Show all plans"
      triggerLabel={(label, selected) =>
        selected.length > 0 ? `${label}: ${selected.join(', ')}. Change the filter` : `Select a ${label.toLowerCase()}`
      }
    />
  )
}
