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
import EditIcon from '@/components/icons/EditIcon';
import DeleteIcon from '@/components/icons/DeleteIcon';
import EditPopup from './EditPopup';
import { useSubtopic } from '@/context/SubtopicContext';
import DeleteDialogue from '@/components/ui/delete-dialog';
import Site from '../../site/_components/AddSite';
import { PaginationDemo } from '@/components/pagination-demo';
import usePagination from '@/hooks/usePagination';

export default function EquipmentTable({searchValue, setIsSite, isSite, setIsArea, isArea}:{searchValue:string, setIsSite: (value: boolean) => void, isSite: boolean, setIsArea: (value: boolean) => void, isArea: boolean}) {
    const [editingRow, setEditingRow] = useState<number | null>(null);
    const { FetchLocationDetails , deleteRecord} = useSubtopic(); // Assuming this is a hook from your context
 const {data,error} =  FetchLocationDetails()
    // Call the hook directly at the top level of the component
    
      
    const handleEditClick = (slNo: number) => {
        setEditingRow(slNo === editingRow ? null : slNo); 
    };

    const handleCloseEdit = () => {
        setEditingRow(null);
    };
    const rearrangedData  = data
    ? data.filter((item: any) =>
        item.location.name.toLowerCase().includes(searchValue.toLowerCase())
      )
    : [];
    const { currentPage, pageSize, totalPages, currentData, handlePreviousPage, handleNextPage, goToPage,setCurrentPage } = usePagination(rearrangedData);
    
    return (
        <div className="px-8 py-3 bg-white w-[98%] mx-auto ">
            <Table className="w-full">
                <TableHeader>
                    <TableRow>
                        <TableHead className="py-4">Sl. No.</TableHead>
                        <TableHead className="py-4">Location</TableHead>
                        <TableHead className="py-4">Site</TableHead>
                        <TableHead className="py-4">Area</TableHead>
                        <TableHead className="py-4">Status</TableHead>
                        <TableHead className="py-4">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {currentData?.map((item:any,idx:any) => (
                        <React.Fragment key={item.id}> 
                            <TableRow>
                                <TableCell className="py-4">{idx + 1}</TableCell>
                                <TableCell className="py-4">{item?.location?.name}</TableCell>
                                <TableCell className="py-4">{item?.site?.name}</TableCell>
                                <TableCell className="py-4">{item?.area?.name}</TableCell>
                                <TableCell className="py-4">{item?.location?.status}</TableCell>
                                <TableCell className="py-4">
                                    <div className="flex space-x-2">
                                        <button onClick={() => handleEditClick(idx + 1)} className="text-red-500">
                                            <EditIcon />
                                        </button>
                                        <DeleteDialogue onConfirm={() => deleteRecord(item.id)} triggerButton={<button className="text-red-500">
                                            <DeleteIcon />
                                        </button>} />
                                    </div>
                                </TableCell>
                            </TableRow>
                            <AnimatePresence>
                                {editingRow === idx + 1 && (
                                    <motion.tr
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <TableCell colSpan={6}>
                                            <div className="overflow-hidden">
                                                {isSite && (<Site onClose={()=>setIsSite(false)} setIsArea={setIsArea}/>)}
                                                {!isSite && (<EditPopup onClose={handleCloseEdit} id={item.id!} setIsSite={setIsSite}/>)}
                                            </div>
                                        </TableCell>
                                    </motion.tr>
                                )}
                            </AnimatePresence>
                        </React.Fragment>
                    ))}
                </TableBody>
            </Table>
            <div className='absolute bottom-0 right-0'>
                <PaginationDemo currentPage={currentPage} totalPages={totalPages} onPreviousPage={handlePreviousPage} onNextPage={handleNextPage} onPageChange={setCurrentPage} />
            </div>
        </div>
    );
}
