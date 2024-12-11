'use client'
import DeleteIcon from "@/components/icons/DeleteIcon";
import EditIcon from "@/components/icons/EditIcon";
import { Button } from "@/components/ui/button"
import DeleteDialogue from "@/components/ui/delete-dialog";
import { DropdownMenu, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ToastVariant, toastWithTimeout } from "@/components/ui/use-toast";
import { makeApiCall } from "@/lib/apicaller";
import { MasterService } from "@/services/api/masters-service";
import { PencilIcon, TrashIcon } from "@heroicons/react/solid";
import { useEffect, useState } from "react";

export default function Component({ onFunction ,isSubmitted,existingData,setValue,deleteRecord}: { onFunction: () => void ,isSubmitted:boolean,existingData:any[],setValue:any,deleteRecord:any}) {
 
   console.log(existingData);
  return (
    <div className="w-full mx-auto py-5">
      <div className="flex justify-between items-center mb-4">
        <span className="font-bold text-lg">Gear List For Certification</span>
        <button onClick={onFunction} type="button" className="text-red-600 font-medium cursor-pointer flex items-center">
          + Add to list
        </button>
      </div>
      <Table className="border border-gray-300">
        <TableHeader>
          <TableRow className="border-b border-gray-300">
            <TableHead className="border-r border-gray-300 p-3 text-left font-semibold">Inspection Date</TableHead>
            <TableHead className="border-r border-gray-300 p-3 text-left font-semibold">Equipment No.</TableHead>
            <TableHead className="border-r border-gray-300 p-3 text-left font-semibold">Test Type</TableHead>
            <TableHead className="border-r border-gray-300 p-3 text-left font-semibold">Result</TableHead>
            <TableHead className="p-3 text-left font-semibold">#</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {existingData?.map((item: any, index: number) => (
            <TableRow key={index} className="hover:bg-gray-50">
              <TableCell className="border-r border-gray-300 p-3">{item.inspection_date}</TableCell>
              <TableCell className="border-r border-gray-300 p-3">{item.equipment_no}</TableCell>
              <TableCell className="border-r border-gray-300 p-3">{item.type_of_exam}</TableCell>
              <TableCell className="border-r border-gray-300 p-3">{item.result}</TableCell>
              <TableCell className="p-3 flex space-x-2">
                <button type="button" className="text-red-600" onClick={()=>setValue('equipment_no',String(item?.equipment_no))}>
                  <EditIcon />
                </button>

         
                                            <DeleteDialogue
                                                onConfirm={async () => await deleteRecord(item.id)}
                                                triggerButton={
                                                  <button className="relative w-full flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
                                                  Delete
                                              </button>
                                                }
                                            />
                                           
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
