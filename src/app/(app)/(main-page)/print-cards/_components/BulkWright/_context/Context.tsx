// StepperContext.tsx
import { toastWithTimeout } from "@/components/ui/use-toast"
import { StudentService } from "@/services/api/students-service"
import { makeApiCall } from "@/lib/apicaller"
import React, { createContext, useContext, useState, ReactNode } from "react"
import * as XLSX from "xlsx"
import { getLastTwoDigitsOfCurrentYear, mapDataFields } from "@/lib/utils"
import { useQuery } from "@tanstack/react-query"
import { fetchUserDetails } from "@/services/api/auth-service"
import { ToastVariant } from "@/components/ui/use-toast"

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
  handleValueChange: (value: string) => void
}

const StepperContext = createContext<StepperContextProps | undefined>(undefined)

export const StepperProvider: React.FC<{ children: ReactNode ,setIsBulk:any}> = ({ children ,setIsBulk}) => {
  const [currentStep, setCurrentStep] = useState(1)
  const [file, setFile] = useState<File | null>(null)
  const [data, setData] = useState<any>([])
  const [duplicateHandling, setDuplicateHandling] = useState<any>("overwrite")
  const [mappings, setMappings] = useState<{ [key: string]: string }>({}) // Add mappings state
 // Using React Query to fetch user active status with object syntax (v5+)
 const { data: userDetails, isLoading, isError } = useQuery({
    queryKey: ['userDetails'],
    queryFn: fetchUserDetails,
  });

  const userName = userDetails?.name !== '' ? userDetails?.name : userDetails?.email?.split('@')[0];

  const uploadBatch = async () => {
    try {
      let mappedData = mapDataFields(data, mappings);
   
      // Use Promise.all to handle multiple async calls in parallel
      await Promise.all(
        mappedData.map((item: any) => {
          if (!item.contact_number?.startsWith('+')) {
            toastWithTimeout(ToastVariant.Success, "Please check the contact number field");
            return Promise.reject();
          }
          
          return makeApiCall(
            async () =>
              new StudentService().addStudent({
                ...item,
                added_by: userName,
                certificate_no: "QSIS-TRA-" + getLastTwoDigitsOfCurrentYear(),
                card_no: "QSIS-TRA-" + getLastTwoDigitsOfCurrentYear(),
              }),
            {
              afterSuccess: () => {
                toastWithTimeout(ToastVariant.Success, "Operation successful");
                setIsBulk(false)
              },
              afterError: (err: any) => {
                toastWithTimeout(ToastVariant.Success, "Please check the Mapped Data and try again");
              },
            }
          )
        })
      );
    } catch (error) {
      console.error("Error uploading batch:", error);
      toastWithTimeout(ToastVariant.Success, "Batch upload failed.");
    }
  };
  

  const goToNextStep = () => {
    if (currentStep < 3) {
      setCurrentStep((prev) => prev + 1)
    }
    if(currentStep===3){
         uploadBatch()
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

  const handleValueChange = (value: string) => {
     setDuplicateHandling(value)
    file&& processFile(file) 
   
  }
  const processFile = (file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const data = new Uint8Array(e.target?.result as ArrayBuffer)
      const workbook = XLSX.read(data, { type: "array" })
      const worksheet = workbook.Sheets[workbook.SheetNames[0]]
      
      // Set raw: false to convert dates and cellDates: true to detect date cells
      const jsonData = XLSX.utils.sheet_to_json(worksheet, {
        raw: false,
        dateNF: 'yyyy-mm-dd',
        cellDates: true
      })
      
      // Process dates and handle any special values
      const processedData = jsonData.map((row: any) => {
        const processed: any = { ...row };
        // Convert date fields if needed
        return processed;
      });
      
      handleDuplicates(processedData)
    }
    reader.readAsArrayBuffer(file)
  }

  const handleDuplicates = (jsonData: any[]) => {
    let processedData
    
    
    if (duplicateHandling === "skip") {
      // Find and remove duplicates after trimming string values
      const uniqueDataMap = new Map();
      const duplicates:any = [];
    
      const trimData = (item:any) => {
        // Create a new object with trimmed string values
        const trimmedItem:any = {};
        Object.keys(item).forEach(key => {
          // Only trim if the value is a string
          trimmedItem[key] = (typeof item[key] === 'string') 
            ? item[key].trim() 
            : item[key];
        });
        return trimmedItem;
      };
    
      jsonData.forEach(item => {
        const trimmedItem = trimData(item);
        const rowKey = JSON.stringify(trimmedItem);
        
        if (uniqueDataMap.has(rowKey)) {
          duplicates.push(item);
        } else {
          uniqueDataMap.set(rowKey, trimmedItem);
        }
      });
    
      processedData = Array.from(uniqueDataMap.values());
      
      // Optional: Log duplicates
      if (duplicates.length > 0) {
    
      }
    } else {
      // Trim data even if not skipping duplicates
      processedData = jsonData.map(item => {
        const trimmedItem:any = {};
        Object.keys(item).forEach(key => {
          trimmedItem[key] = (typeof item[key] === 'string') 
            ? item[key].trim() 
            : item[key];
        });
        return trimmedItem;
      });
    }
    
    setData(processedData);
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
        handleValueChange
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
