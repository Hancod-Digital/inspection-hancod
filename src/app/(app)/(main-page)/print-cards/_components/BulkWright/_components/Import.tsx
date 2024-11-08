// Import.tsx
import * as React from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Upload } from "lucide-react"
import { useStepper } from "../_context/Context"

const Import: React.FC = () => {
  const { file, handleFileChange, duplicateHandling, setDuplicateHandling ,handleValueChange} = useStepper()

  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    if (selectedFile) {
      handleFileChange(selectedFile)
    }
  }

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    const droppedFile = event.dataTransfer.files[0]
    if (droppedFile) {
      handleFileChange(droppedFile)
    }
  }

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
  }
  

  return (
    <div>
      <Card className="p-8 border-dashed" onDrop={handleDrop} onDragOver={handleDragOver}>
        <div className="flex flex-col items-center justify-center text-center">
          <Upload className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-sm mb-2">Drag and drop file to import</p>
          <p className="text-sm text-muted-foreground mb-4">
            Maximum File Size: 25 MB • File Format: CSV or XLS
          </p>
          <div className="relative">
            <input
              type="file"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              accept=".csv,.xls,.xlsx"
              onChange={handleFileInputChange}
            />
            <Button variant="default" className="bg-primary text-primary-foreground">
              Choose File
            </Button>
          </div>
        </div>
      </Card>

      <p className="text-sm text-muted-foreground mt-4 mb-8">
        Download a sample file and compare it to your import file to ensure you have the file perfect for the import.
      </p>

      <div className="space-y-6">
        <h2 className="text-base font-semibold mb-4">Duplicate Handling:</h2>
        <RadioGroup
          defaultValue={duplicateHandling}
          value={duplicateHandling}
          onValueChange={(selectedValue) => handleValueChange(selectedValue)} 
          className="space-y-4"
        >
          <div className="flex items-start space-x-3">
            <RadioGroupItem value="skip" id="skip" className="mt-3" />
            <div>
              <Label htmlFor="skip" className="font-medium">Skip Duplicates</Label>
              <p className="text-sm text-muted-foreground">
                Retains the items and does not import the duplicates in the import file.
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <RadioGroupItem value="overwrite" id="overwrite" className="mt-3" />
            <div>
              <Label htmlFor="overwrite" className="font-medium">Overwrite Items</Label>
              <p className="text-sm text-muted-foreground">
                Imports the duplicates in the import file and overwrites the existing items.
              </p>
            </div>
          </div>
        </RadioGroup>
      </div>
    </div>
  )
}

export default Import
