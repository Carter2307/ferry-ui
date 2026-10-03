import { Badge, RadioCard, RadioCardGroup } from 'libui'

const PLANS = [
  { value: 'free', label: 'Free', description: 'For one member and three projects.', price: '$0', popular: false },
  { value: 'pro', label: 'Pro', description: 'For a team, with no limit on projects.', price: '$19', popular: true },
  { value: 'team', label: 'Team', description: 'With roles and an audit log.', price: '$49', popular: false },
]

export default function RadioCardGroupChildren() {
  return (
    <RadioCardGroup aria-label="Plan" columns={3} defaultValue="pro" className="mx-auto w-full max-w-2xl">
      {PLANS.map((plan) => (
        <RadioCard key={plan.value} value={plan.value} label={plan.label} description={plan.description}>
          {/* Text and a badge only: the card is a button, so it cannot hold a button or a link. */}
          <span className="mt-1.5 flex flex-wrap items-center gap-2">
            <span className="text-[13px] font-medium text-foreground tabular">
              {plan.price}
              <span className="font-normal text-foreground-lighter"> / month</span>
            </span>
            {plan.popular && <Badge>Popular</Badge>}
          </span>
        </RadioCard>
      ))}
    </RadioCardGroup>
  )
}
