import { EmptyState } from 'libui'
import { FileQuestion, FolderKanban, MessageSquare } from 'lucide-react'

export default function EmptyStateVariants() {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <EmptyState
        variant="dashed"
        size="sm"
        icon={<FolderKanban />}
        title="No projects yet"
        description="The dashed variant."
      />
      <EmptyState
        variant="bordered"
        size="sm"
        icon={<FileQuestion />}
        title="Page not found"
        description="The bordered variant."
      />
      <EmptyState
        variant="plain"
        size="sm"
        icon={<MessageSquare />}
        title="No comments yet"
        description="The plain variant."
      />
    </div>
  )
}
