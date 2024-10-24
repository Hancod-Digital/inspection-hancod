import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export default function Component({onFunction,competencies}:{onFunction: ()=>void,competencies:any}) {
  return (
    <div className="w-full  mx-auto py-5">
      <div className="flex justify-between items-center mb-4">
      <span className="font-bold">Surveyor Competency</span>

        <span onClick={onFunction} className="text-red-600 cursor-pointer">New</span>
      </div>
      <Table className="border border-gray-200">
        <TableHeader>
          <TableRow className="border-b">
            <TableHead className="w-[100px] border-r p-2 text-left">SL.No.</TableHead>
            <TableHead className="border-r p-2 text-left">Competency</TableHead>
            <TableHead className="border-r p-2 text-left">Validity</TableHead>
            <TableHead className="p-2 text-left">Attachment</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {competencies.map((item:any, index:number) => (
            <TableRow key={index} className="border-b">
              <TableCell className="border-r p-2 h-12">{index + 1}</TableCell>
              <TableCell className="border-r p-2 h-12">{item.competency}</TableCell>
              <TableCell className="border-r p-2 h-12">{item.validity}</TableCell>
              <TableCell className="p-2 h-12"><a href={item.attachment} target="_blank">Document</a></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
    </div>
  )
}