'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { PencilIcon, TrashIcon } from '@heroicons/react/outline'; // Assuming you're using heroicons

interface EquipmentData {
    slNo: number;
    equipmentType: string;
    category: string;
    status: string;
}
import EditPopup from './EditPopup'
import EditIcon from '@/components/icons/EditIcon';
import DeleteIcon from '@/components/icons/DeleteIcon';
import { useSubtopic } from '@/context/SubtopicContext';
import DeleteDialogue from '@/components/ui/delete-dialog';
import { PaginationDemo } from '@/components/pagination-demo';
import usePagination from '@/hooks/usePagination';



export default function EquipmentTable({searchValue}:{searchValue:string}) {
    const [editingRow, setEditingRow] = useState<number | null>(null);
    const { data, isLoading, error,deleteRecord } = useSubtopic();
    const { currentPage, pageSize, totalPages, currentData, handlePreviousPage, handleNextPage, goToPage,setCurrentPage } = usePagination(data?.filter((item:any)=>item?.equipment_type?.toLowerCase()?.includes(searchValue?.toLowerCase())));
    const rearrangedData  = data
    ? data.filter((item: any) =>
        item.equipment_type.toLowerCase().includes(searchValue.toLowerCase())
      )
    : [];


    const handleEditClick = (slNo: number) => {
        setEditingRow(slNo === editingRow ? null : slNo);
    };

    const handleCloseEdit = () => {
        setEditingRow(null);
    };

    return (
        <div className="px-8 py-3 bg-white w-[98%] mx-auto  ">
            <Table className="w-full">
                <TableHeader>
                    <TableRow>
                        <TableHead className="py-4">Sl. No.</TableHead>
                        <TableHead className="py-4">Equipment Type</TableHead>
                        <TableHead className="py-4">Category Name</TableHead>
                        <TableHead className="py-4">Status</TableHead>
                        <TableHead className="py-4">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                    currentData && currentData.length === 0 ? (
          <TableRow>
            <TableCell colSpan={9}>
              <div className="text-center text-gray-400 py-8">NO DATA AVAILABLE</div>
            </TableCell>
          </TableRow>
        ) : (
                    currentData?.map((item:any,idx:any) => (
                        <React.Fragment key={idx+1}>
                            <TableRow>
                                <TableCell className="py-4">{(currentPage - 1) * pageSize + idx + 1}</TableCell>
                                <TableCell className="py-4">{item?.equipment_type}</TableCell>
                                <TableCell className="py-4">{item?.category}</TableCell>
                                <TableCell className="py-4">{item?.status}</TableCell>
                                <TableCell className="py-4">
                                    <div className="flex space-x-2">
                                        <button onClick={() => handleEditClick(idx+1)} className="text-red-500">
                                            <EditIcon/>
                                        </button>
                                        <DeleteDialogue
                                                onConfirm={async () => await deleteRecord(item.id)}
                                                triggerButton={
                                                    <button className="text-red-500">
                                                        <DeleteIcon />
                                                    </button>
                                                }
                                            />
 
                                    </div>
                                </TableCell>
                            </TableRow>
                            <AnimatePresence>
                            {editingRow === idx+1 && (
                                    <motion.tr
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <TableCell colSpan={9}>
                                            <div className="overflow-hidden">
                                                <EditPopup onClose={handleCloseEdit} id={item.id} />
                                            </div>
                                        </TableCell>
                                    </motion.tr>
                                )}
                            </AnimatePresence>
                        </React.Fragment>
                    ))
                    )}
                </TableBody>
            </Table>
            {/* <PaginationDemo currentPage={currentPage} totalPages={totalPages} onPreviousPage={handlePreviousPage} onNextPage={handleNextPage} onPageChange={setCurrentPage} /> */}
            {data && data.length > 6 && (
                <div className='absolute bottom-0 right-0'>
                  <PaginationDemo
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPreviousPage={handlePreviousPage}
                    onNextPage={handleNextPage}
                    onPageChange={setCurrentPage}
                  />
                </div>
              )}
        </div>
    );
}
