import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export default function Component({onFunction}:{onFunction: ()=>void}) {
  return (
    <div className="w-full mx-auto py-5">
      <div className="flex justify-between items-center mb-4">
        <span className="font-bold">Annexures</span>
        <span onClick={onFunction} className="text-red-600 cursor-pointer">Reset</span>
      </div>
      <Table className="border border-gray-200">
        <TableHeader>
          <TableRow className="border-b">
            <TableHead className="border-r p-2 text-left">Property</TableHead>
            <TableHead className="border-r p-2 text-left">Value</TableHead>
            <TableHead className="p-2 text-left">Remarks</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell colSpan={3} className="p-2 text-center text-gray-500">
              No data to display
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  )
}
