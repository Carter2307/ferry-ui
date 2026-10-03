import * as React from 'react'
import { SearchInput } from 'libui-kit'

export default function SearchInputDemo() {
  const [query, setQuery] = React.useState('')

  return (
    <>
      <SearchInput placeholder="Search invoices" value={query} onValueChange={setQuery} />
      <span className="text-[13px] text-foreground-light" aria-live="polite">
        {query === '' ? 'The query is empty.' : `Query: ${query}`}
      </span>
    </>
  )
}
