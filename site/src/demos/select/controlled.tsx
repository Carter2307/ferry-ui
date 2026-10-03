import * as React from 'react'
import { Button, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from 'libui'

export default function SelectControlled() {
  const [language, setLanguage] = React.useState('')

  return (
    <>
      <Select value={language} onValueChange={setLanguage}>
        <SelectTrigger className="w-48" aria-label="Language">
          <SelectValue placeholder="Select a language" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="en">English</SelectItem>
          <SelectItem value="fr">French</SelectItem>
          <SelectItem value="de">German</SelectItem>
          <SelectItem value="es">Spanish</SelectItem>
          <SelectItem value="ja">Japanese</SelectItem>
        </SelectContent>
      </Select>
      {/* An empty value shows the placeholder again. */}
      <Button variant="ghost" disabled={language === ''} onClick={() => setLanguage('')}>
        Clear
      </Button>
    </>
  )
}
