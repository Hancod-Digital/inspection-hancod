import Property from "@/app/(app)/(main-page)/masters/(subtopics)/property/page"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { makeApiCall } from "@/lib/apicaller"
import { MasterService } from "@/services/api/masters-service"
import { useEffect, useState } from "react"

interface Annexure {
  id: string
  property: string
  property_group: string
  condition: string
}

interface EquipmentDetail {
  annexure: string
}

export default function AnnexuresTable({property_table_type,propertyList,setPropertyList}:{property_table_type:string,propertyList:any,setPropertyList:any}) {
  const [annexureData, setAnnexureData] = useState<Annexure[]>([])
  const [previousPropertyTableType, setPreviousPropertyTableType] = useState<string>('')
  const [initialLoad, setInitialLoad] = useState(true)
 
  // Fetch annexure based on property_table_type
  useEffect(() => {
    if (property_table_type) {
      makeApiCall(()=>new MasterService().getAnnexureByPropertyTableType(property_table_type),{afterSuccess:(data: any)=>{
        if (data && data.length > 0) {
          setAnnexureData(data)
          
          // Fetch property list for this annexure
          const hasPropertyTableTypeChanged = property_table_type !== previousPropertyTableType && previousPropertyTableType !== '';
          const shouldFetch = (!propertyList || propertyList.length === 0) || hasPropertyTableTypeChanged;
          
          if (shouldFetch) {
            makeApiCall(()=>new MasterService().getPropertyList(data[0].id),{afterSuccess:(propertyData: Annexure[])=>{
              setPropertyList(propertyData)
            }})
          }
        }
      }})
      
      setPreviousPropertyTableType(property_table_type);
    }
  }, [property_table_type])

  const handleReset = () => {
    setPropertyList(propertyList.map((item:any) => ({
      ...item,
      Property: '',
      property_group: '',
      condition: ''
    })))
  }

  const handlePropertyChange = (id: string, value: string) => {
    setPropertyList(propertyList.map((item:any) => 
      item.id === id ? { ...item, property: value } : item
    ))
  }

  const handleRemarksChange = (id: string, value: string) => {
    setPropertyList(propertyList.map((item:any) =>
      item.id === id ? { ...item, remarks: value } : item  
    ))
  }

  const handleConditionChange = (id: string, value: string) => {
    setPropertyList(propertyList.map((item:any) =>
      item.id === id ? { ...item, condition: value } : item
    ))
  }

  return (
    <div className="w-full mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-md font-semibold">Annexures</h2>
        {/* <Button
          variant="default"
          type="button"
          className="text-destructive hover:text-destructive bg-white"
          onClick={handleReset}
        >
          Reset
        </Button> */}
      </div>
      <div className="border rounded-lg overflow-hidden">
        <Table className="border-collapse">
          <TableHeader>
            <TableRow>
              <TableHead className="border border-gray-200 w-[200px]">Property</TableHead>
              <TableHead className="border border-gray-200 w-[200px]">Value</TableHead>
              <TableHead className="border border-gray-200 w-[200px]">Remarks</TableHead>
              <TableHead className="border border-gray-200 w-[100px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {propertyList.map((item:any) => (
              <TableRow key={item.id}>
                <TableCell className="border border-gray-200">
                  <input
                    type="text"
                    className="w-full bg-gray-50 border-0 focus:outline-none rounded p-1"
                    placeholder="Enter property"
                    value={item.property}
                    onChange={(e) => handlePropertyChange(item.id, e.target.value)}
                  />
                </TableCell>
                <TableCell className="border border-gray-200">
                <input
                    type="text"
                    className="w-full bg-gray-50 border-0 focus:outline-none rounded p-1"
                    placeholder="Enter remarks"
                    value={item.condition}
                    onChange={(e) => handleConditionChange(item.id, e.target.value)}
                  />
                </TableCell>
                <TableCell className="border border-gray-200">
                  <input
                    type="text"
                    className="w-full bg-gray-50 border-0 focus:outline-none rounded p-1"
                    placeholder="Enter remarks"
                    value={item.remarks || ''}
                    onChange={(e) => handleRemarksChange(item.id, e.target.value)}
                  />
                </TableCell>
                <TableCell className="border border-gray-200"></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
