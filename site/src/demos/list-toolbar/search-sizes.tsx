import { SearchInput } from 'ferry-ui'

export default function SearchInputSizes() {
  return (
    <div className="flex w-full max-w-xs flex-col gap-3">
      <SearchInput size="tiny" placeholder="Search members" />
      <SearchInput size="sm" placeholder="Search members" />
      <SearchInput size="md" placeholder="Search members" />
    </div>
  )
}
