import { Button, EmptyState, toast } from 'ferry-ui'
import { FolderKanban, Plus } from 'lucide-react'

export default function NoProjects() {
  return (
    <EmptyState
      icon={<FolderKanban />}
      title="No projects yet"
      description="Projects group your invoices, members and API keys."
      actions={
        <Button variant="primary" icon={<Plus />} onClick={() => toast.success('Project created')}>
          New project
        </Button>
      }
    />
  )
}
