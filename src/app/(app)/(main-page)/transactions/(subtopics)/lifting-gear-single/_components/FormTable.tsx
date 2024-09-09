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
        <span className="font-bold">Properties</span>
        <span onClick={onFunction} className="text-red-600 cursor-pointer">New</span>
      </div>
      <Table className="border border-gray-200">
        <TableHeader>
          <TableRow className="border-b">
            <TableHead className="border-r p-2 text-left w-1/2">Test Load</TableHead>
            <TableHead className="p-2 text-left w-1/2">SWL</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {[...Array(4)].map((_, index) => (
            <TableRow key={index} className="border-b">
              <TableCell className="border-r p-2 h-12 w-1/2"></TableCell>
              <TableCell className="p-2 h-12 w-1/2"></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
