// Component2.js
import * as React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useStepper } from "../_context/Context"

// Define the fields to map to
const fields = [
  { id: "name", label: "Name" },
  { id: "contact_number", label: "Contact Number" },
  { id: "email", label: "Email" },
  { id: "address", label: "Address" },
  { id: "gender", label: "Gender" },
  { id: "company", label: "Company" },
  { id: "id_no", label: "Qatar ID/ Employer ID No." },
  { id: "designation", label: "Designation / Course" },
  { id: "issued_on", label: "Issued On" },
  { id: "model_level", label: "Model/Level" },
  { id: "valid_untill", label: "Expiry Date" },
]

export default function Component2() {
  const { data, mappings, setMappings } = useStepper()  // Access imported data, mappings, and setMappings from context

  // Extract headers from the first row of the data
  const headers = data.length > 0 ? Object.keys(data[0]) : []

  // Update the mappings state when a field is mapped to a specific header
  const handleMappingChange = (fieldId: string, selectedHeader: string) => {
    setMappings((prevMappings:any) => ({
      ...prevMappings,
      [fieldId]: selectedHeader,
    }))
  }

  const companyDetailIndex = fields.findIndex((field) => field.id === "company")

  return (
    <Card className="w-full p-5 mx-auto">
      <CardContent className="p-6">
        <p className="text-sm text-muted-foreground mb-6">Your Selected File: sample_userdetails.csv</p>

        <div className="grid gap-8 md:grid-cols-2">
          <h3 className="text-lg font-medium mb-4">Details</h3>
          <h3 className="text-lg font-medium mb-4">IMPORTED FILE HEADERS</h3>
        </div>

        <div className="space-y-2">
          {fields.map((field, index) => (
            <React.Fragment key={field.id}>
              {index === companyDetailIndex && (
                <div className="text-primary font-medium mt-4 mb-2 md:col-span-2">Company/Other Details</div>
              )}
              <div className="grid gap-8 md:grid-cols-2 items-center">
                <div className="text-sm">{field.label}</div>
                <Select
                  value={mappings[field.id] || "none"} // Set default value based on mappings
                  onValueChange={(value) => {
                    console.log(value+"value--------------------");
                    handleMappingChange(field.id, value)
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={mappings[field.id] || "Select column"} />
                  </SelectTrigger>
                  <SelectContent>
                    {/* Render headers as options */}
                    {headers.map((header) => (
                      <SelectItem key={header} value={header}>
                        {header}
                      </SelectItem>
                    ))}
                    <SelectItem value="none">None</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </React.Fragment>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
