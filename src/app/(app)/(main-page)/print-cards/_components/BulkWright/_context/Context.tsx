// StepperContext.tsx
import React, { createContext, useContext, useState, ReactNode } from "react"
import * as XLSX from "xlsx"

interface StepperContextProps {
  currentStep: number
  setCurrentStep: (step: number) => void
  file: File | null
  setFile: (file: File | null) => void
  data: any[]
  setData: (data: any[]) => void
  duplicateHandling: string
  setDuplicateHandling: (value: string) => void
  mappings: { [key: string]: string }
  setMappings: any
  goToNextStep: () => void
  goToPreviousStep: () => void
  handleFileChange: (file: File) => void
  processFile: (file: File) => void
}

const StepperContext = createContext<StepperContextProps | undefined>(undefined)

export const StepperProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentStep, setCurrentStep] = useState(1)
  const [file, setFile] = useState<File | null>(null)
  const [data, setData] = useState<any>([])
  const [duplicateHandling, setDuplicateHandling] = useState<any>("skip")
  const [mappings, setMappings] = useState<{ [key: string]: string }>({}) // Add mappings state

  const goToNextStep = () => {
    if (currentStep < 3) {
      setCurrentStep((prev) => prev + 1)
    }
  }

  const goToPreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1)
    }
  }

  const handleFileChange = (selectedFile: File) => {
    if (selectedFile && selectedFile.size <= 25 * 1024 * 1024) { // 25MB limit
      setFile(selectedFile)
      processFile(selectedFile)
    } else {
      alert("File size exceeds 25MB limit")
    }
  }

  const processFile = (file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const data = new Uint8Array(e.target?.result as ArrayBuffer)
      const workbook = XLSX.read(data, { type: "array" })
      const worksheet = workbook.Sheets[workbook.SheetNames[0]]
      const jsonData = XLSX.utils.sheet_to_json(worksheet)
      handleDuplicates(jsonData)
    }
    reader.readAsArrayBuffer(file)
  }

  const handleDuplicates = (jsonData: any[]) => {
    let processedData
    console.log(jsonData?.length);
    
   if (duplicateHandling === "skip") {
      const uniqueDataMap = new Map()
      jsonData.forEach(item => uniqueDataMap.set(item.id, item))
      processedData = Array.from(uniqueDataMap.values())
      console.log(duplicateHandling,"here");
        
      console.log(processedData?.length);
      
    }else{
        console.log(duplicateHandling);
        
        processedData = jsonData
    }
    console.log(processedData?.length,"lokok");
    
    setData(processedData)
  }

  return (
    <StepperContext.Provider
      value={{
        currentStep,
        setCurrentStep,
        file,
        setFile,
        data,
        setData,
        duplicateHandling,
        setDuplicateHandling,
        mappings,
        setMappings,
        goToNextStep,
        goToPreviousStep,
        handleFileChange,
        processFile,
      }}
    >
      {children}
    </StepperContext.Provider>
  )
}

export const useStepper = (): StepperContextProps => {
  const context = useContext(StepperContext)
  if (context === undefined) {
    throw new Error("useStepper must be used within a StepperProvider")
  }
  return context
}
