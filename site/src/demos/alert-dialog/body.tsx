import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogBody,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  Button,
} from 'libui-kit'

const MEMBERS = [
  { name: 'Maya Chen', email: 'maya@example.com', role: 'Admin' },
  { name: 'Sam Lee', email: 'sam@example.com', role: 'Developer' },
  { name: 'Ada Park', email: 'ada@example.com', role: 'Viewer' },
]

export default function AlertDialogWithBody() {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">Remove 3 members</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Remove 3 members?</AlertDialogTitle>
          <AlertDialogDescription>They lose access to each project of this workspace.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogBody className="gap-0 py-2">
          {MEMBERS.map((member) => (
            <div key={member.email} className="flex items-center justify-between gap-3 border-b py-2 last:border-b-0">
              <div className="flex min-w-0 flex-col">
                <span className="truncate text-[13px] font-medium text-foreground">{member.name}</span>
                <span className="truncate text-xs text-foreground-lighter">{member.email}</span>
              </div>
              <span className="text-xs text-foreground-light">{member.role}</span>
            </div>
          ))}
        </AlertDialogBody>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction variant="destructive-solid">Remove members</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
