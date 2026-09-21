import React from 'react'
import { DashboardEquipment } from '@/services/api/dashboard-service'
import { formatDate } from '@/services/api/utils'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export default function Component({ equipment }: { equipment: DashboardEquipment[] }) {
  const equipmentData = equipment
    .filter((item) => item.next_thorough_date || item.next_test_date)
    .sort((a, b) => new Date(a.next_thorough_date ?? a.next_test_date ?? '').getTime() - new Date(b.next_thorough_date ?? b.next_test_date ?? '').getTime())
    .slice(0, 10);
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
          {equipmentData.map((item, index) => (
            <TableRow key={item.id} className='py-5'>
              <TableCell><div className="py-4">{index + 1}</div></TableCell>
              <TableCell><div className="py-4">{item.equipment_no ?? item.equipment ?? item.title ?? '—'}</div></TableCell>
              <TableCell><div className="py-4">{item.last_thorough_date || item.last_test_date ? formatDate(item.last_thorough_date ?? item.last_test_date ?? '') : '—'}</div></TableCell>
              <TableCell><div className="py-4">{formatDate(item.next_thorough_date ?? item.next_test_date ?? '')}</div></TableCell>
              <TableCell><div className="py-4">{item.next_thorough_date ? 'Thorough' : 'Test'}</div></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
