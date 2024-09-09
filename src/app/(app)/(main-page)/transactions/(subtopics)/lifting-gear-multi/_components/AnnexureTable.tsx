import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export default function Component({ onFunction }: { onFunction: () => void }) {
  return (
    <div className="w-full mx-auto py-5">
      <div className="flex justify-between items-center mb-4">
        <span className="font-bold">Gear List For Certification</span>
        <span onClick={onFunction} className="text-red-600 cursor-pointer">Reset</span>
      </div>
      <Table className="border border-gray-200">
        <TableHeader>
          <TableRow className="border-b">
            <TableHead className="border-r p-2 text-left">Inspection Date</TableHead>
            <TableHead className="border-r p-2 text-left">Equipment No.</TableHead>
            <TableHead className="border-r p-2 text-left">Test Type</TableHead>
            <TableHead className="border-r p-2 text-left">Result</TableHead>
            <TableHead className="p-2 text-left">#</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 4 }).map((_, index) => (
            <TableRow key={index}>
              <TableCell className="border-r p-2"></TableCell>
              <TableCell className="border-r p-2"></TableCell>
              <TableCell className="border-r p-2"></TableCell>
              <TableCell className="border-r p-2"></TableCell>
              <TableCell className="p-2">{" #"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
