import React from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface EquipmentData {
  slNo: number
  equipmentNo: string
  lastInspDate: string
  dueDate: string
  testType: string
}

const equipmentData: EquipmentData[] = [
  { slNo: 1, equipmentNo: 'ZP 40-D', lastInspDate: '20-10-2024', dueDate: '20-10-2024', testType: 'Thorough' },
  { slNo: 2, equipmentNo: 'ZP 40-D', lastInspDate: '20-10-2024', dueDate: '20-10-2024', testType: 'Thorough' },
  { slNo: 3, equipmentNo: 'ZP 40-D', lastInspDate: '20-10-2024', dueDate: '20-10-2024', testType: 'Thorough' },
  { slNo: 4, equipmentNo: 'ZP 40-D', lastInspDate: '20-10-2024', dueDate: '20-10-2024', testType: 'Thorough' },
  { slNo: 5, equipmentNo: 'ZP 40-D', lastInspDate: '20-10-2024', dueDate: '20-10-2024', testType: 'Thorough' },
]

export default function Component() {
  return (
    <div className="p-10 bg-white">
      <h1 className="text-xl font-bold mb-4">Equipment Due Date</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]"><div className="py-4  ">Sl. No.</div></TableHead>
            <TableHead><div className="py-4  ">Equipment No.</div></TableHead>
            <TableHead><div className="py-4  ">Last Insp Date</div></TableHead>
            <TableHead><div className="py-4  ">Due Date</div></TableHead>
            <TableHead><div className="py-4  ">Test Type</div></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {equipmentData.map((item) => (
            <TableRow key={item.slNo} className='py-5'>
              <TableCell><div className="py-4  ">{item.slNo}</div></TableCell>
              <TableCell><div className="py-4  ">{item.equipmentNo}</div></TableCell>
              <TableCell><div className="py-4  ">{item.lastInspDate}</div></TableCell>
              <TableCell><div className="py-4  ">{item.dueDate}</div></TableCell>
              <TableCell><div className="py-4  ">{item.testType}</div></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}