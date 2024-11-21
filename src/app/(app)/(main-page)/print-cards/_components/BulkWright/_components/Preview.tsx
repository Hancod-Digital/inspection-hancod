// Component.js
import * as React from "react"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { ChevronDown } from "lucide-react"
import { useStepper } from "../_context/Context"

export default function Component() {
  const { data, mappings } = useStepper() // Access imported data and mappings from context

  // Calculate the number of records ready to import based on mappings
  const readyToImportCount = data.filter(row =>
    Object.keys(mappings).every(field => mappings[field] && row[mappings[field]])
  ).length
console.log(data,mappings);

  // Calculate the number of skipped records (total records - ready to import)
  const skippedRecordsCount = data.length - readyToImportCount
 
  // Calculate the number of unmapped fields
  const unmappedFieldsCount = Object.keys(mappings).filter(
    field => !mappings[field] || mappings[field] === "none"
  ).length

  return (
    <div className="w-full space-y-4 p-3">
      <p className="text-sm text-muted-foreground">
        {readyToImportCount} of {data.length} user data {mappings?.length}in your file are ready to be imported.
      </p>

      <div className="space-y-2">
        <Collapsible>
          <CollapsibleTrigger className="flex w-full items-center justify-between rounded-lg border p-4 text-left hover:bg-muted/50">
            <span>User data that are ready to be imported - {readyToImportCount}</span>
            <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200" />
          </CollapsibleTrigger>
          <CollapsibleContent className="px-4 py-2">
            <div className="rounded-lg border p-2">
              {/* Display content related to records ready to be imported */}
              {readyToImportCount} records are ready to be imported.
            </div>
          </CollapsibleContent>
        </Collapsible>

        <Collapsible>
          <CollapsibleTrigger className="flex w-full items-center justify-between rounded-lg border p-4 text-left hover:bg-muted/50">
            <span>No. of Records skipped - {skippedRecordsCount}</span>
            <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200" />
          </CollapsibleTrigger>
          <CollapsibleContent className="px-4 py-2">
            <div className="rounded-lg border p-4">
              {/* Display content related to skipped records */}
              {skippedRecordsCount} records were skipped.
            </div>
          </CollapsibleContent>
        </Collapsible>

        <Collapsible>
          <CollapsibleTrigger className="flex w-full items-center justify-between rounded-lg border p-4 text-left hover:bg-muted/50">
            <span>Unmapped Fields - {unmappedFieldsCount}</span>
            <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200" />
          </CollapsibleTrigger>
          <CollapsibleContent className="px-4 py-2">
            <div className="rounded-lg border p-4">
              {/* Display content related to unmapped fields */}
              {unmappedFieldsCount} fields are unmapped.
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  )
}
