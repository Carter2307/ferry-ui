import * as React from 'react'
import { Button, Tabs, TabsContent, TabsList, TabsTrigger } from 'libui-kit'

const STEPS = ['details', 'members', 'review']

export default function TabsControlled() {
  const [step, setStep] = React.useState('details')
  const index = STEPS.indexOf(step)

  return (
    <Tabs value={step} onValueChange={setStep} className="w-full max-w-md">
      <TabsList variant="pills" aria-label="New project">
        <TabsTrigger value="details">Details</TabsTrigger>
        <TabsTrigger value="members">Members</TabsTrigger>
        <TabsTrigger value="review">Review</TabsTrigger>
      </TabsList>
      <TabsContent value="details" className="text-[13px] text-foreground-light">
        The name and the description of the project.
      </TabsContent>
      <TabsContent value="members" className="text-[13px] text-foreground-light">
        The members who get an invitation.
      </TabsContent>
      <TabsContent value="review" className="text-[13px] text-foreground-light">
        A summary of the project before you create it.
      </TabsContent>
      <div className="flex justify-between">
        <Button size="tiny" disabled={index === 0} onClick={() => setStep(STEPS[index - 1] ?? step)}>
          Back
        </Button>
        <Button size="tiny" disabled={index === STEPS.length - 1} onClick={() => setStep(STEPS[index + 1] ?? step)}>
          Next
        </Button>
      </div>
    </Tabs>
  )
}
