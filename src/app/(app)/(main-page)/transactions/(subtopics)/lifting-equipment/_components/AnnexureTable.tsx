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

export default function AnnexuresTable({id,propertyList,setPropertyList}:{id:string,propertyList:any,setPropertyList:any}) {
  const [equipmentDetails, setEquipmentDetails] = useState<EquipmentDetail[]>([])

  const [annexureData, setAnnexureData] = useState<Annexure[]>([])
 
  useEffect(() => {
    makeApiCall(()=>new MasterService().fetchEquipmentDetails(id),{afterSuccess:(data: EquipmentDetail[])=>{
      setEquipmentDetails(data)
    }})
  }, [id])

  useEffect(() => {
    if (equipmentDetails[0]?.annexure) {
      makeApiCall(()=>new MasterService().getAnnexures(equipmentDetails[0].annexure),{afterSuccess:(data: Annexure[])=>{
        console.log(data)
        setAnnexureData(data)
      }})
    }
  }, [equipmentDetails])

  useEffect(() => {
    if (equipmentDetails[0]?.annexure) {
      makeApiCall(()=>new MasterService().getPropertyList(equipmentDetails[0].annexure),{afterSuccess:(data: Annexure[])=>{
        console.log(data)
        setPropertyList(data)
      }})
    }
  }, [equipmentDetails])

  const handleReset = () => {
    setPropertyList(propertyList.map(item => ({
      ...item,
      property_group: '',
      condition: ''
    })))
  }

  const handlePropertyChange = (id: string, value: string) => {
    setPropertyList(propertyList.map(item => 
      item.id === id ? { ...item, property: value } : item
    ))
  }

  const handleValueChange = (id: string, value: string) => {
    setPropertyList(propertyList.map(item =>
      item.id === id ? { ...item, property_group: value } : item  
    ))
  }

  const handleRemarksChange = (id: string, value: string) => {
    setPropertyList(propertyList.map(item =>
      item.id === id ? { ...item, condition: value } : item
    ))
  }

  return (
    <div className="w-full mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-md font-semibold">Annexures</h2>
        <Button
          variant="default"
          className="text-destructive hover:text-destructive bg-white"
          onClick={handleReset}
        >
          Reset
        </Button>
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
            {propertyList.map((item) => (
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
                    placeholder="Enter value"
                    value={item.property_group}
                    onChange={(e) => handleValueChange(item.id, e.target.value)}
                  />
                </TableCell>
                <TableCell className="border border-gray-200">
                  <input
                    type="text"
                    className="w-full bg-gray-50 border-0 focus:outline-none rounded p-1"
                    placeholder="Enter remarks"
                    value={item.condition}
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
