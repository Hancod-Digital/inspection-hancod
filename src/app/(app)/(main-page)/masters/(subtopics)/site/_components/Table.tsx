'use client';
import React, { useEffect, useState } from 'react';
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
import { siteDataRange } from '@/lib/utils';
import DeleteDialogue from '@/components/ui/delete-dialog';
import Area from '../../area/_components/AddEquipment';
import { PaginationDemo } from '@/components/pagination-demo';
import usePagination from '@/hooks/usePagination';

export default function EquipmentTable({searchValue, setIsArea, isArea}:{searchValue:string, setIsArea: (value: boolean) => void, isArea: boolean}) {
    const [editingRow, setEditingRow] = useState<number | null>(null);
    const { isLoading, error, getMergedData, deleteRecord } = useSubtopic();
    const [subtopics, setSubtopics] = useState<any[]>([]); // Define the type as needed

    useEffect(() => {
        async function fetchSubtopics() {
            try {
                const site = await getMergedData(siteDataRange, 'site');
                setSubtopics(site);
            } catch (error) {
                console.error("Error fetching subtopics:", error);
            }
        }

        fetchSubtopics();
    }, [getMergedData]);

    const rearrangedData =  subtopics?.filter((item:any)=>item.site.toLowerCase().includes(searchValue.toLowerCase()))
    const handleEditClick = (slNo: number) => {
        setEditingRow(slNo === editingRow ? null : slNo);
    };

    const handleCloseEdit = () => {
        setEditingRow(null);
    };

    const handleDeleteClick = (item: any) => {
        // You can add any additional logic before deleting
        // For example, confirming deletion is handled by DeleteAlertDialog
    };

    const { currentPage, pageSize, totalPages, currentData, handlePreviousPage, handleNextPage, goToPage,setCurrentPage } = usePagination(rearrangedData);

    return (
        <div className="px-8 py-3 bg-white w-[98%] mx-auto">
            {isLoading ? (
                <div>Loading...</div>
            ) : error ? (
                <div>Error loading data</div>
            ) : (
                <>
                <Table className="w-full relative ">
                    <TableHeader>
                        <TableRow>
                            <TableHead className="py-4">Sl. No.</TableHead>
                            <TableHead className="py-4">Site</TableHead>
                            <TableHead className="py-4">Area</TableHead>
                            <TableHead className="py-4">Status</TableHead>
                            <TableHead className="py-4">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {currentData?.map((item: any, idx: number) => (
                            <React.Fragment key={item.id}>
                                <TableRow>
                                    <TableCell className="py-4">{idx + 1}</TableCell>
                                    <TableCell className="py-4">{item.site}</TableCell>
                                    <TableCell className="py-4">{item.area?.thumbnail}</TableCell>
                                    <TableCell className="py-4">{item.status}</TableCell>
                                    <TableCell className="py-4">
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => handleEditClick(idx + 1)}
                                                className="text-red-500"
                                            >
                                                <EditIcon />
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
                                    {editingRow === idx + 1 && (
                                        <motion.tr
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <TableCell colSpan={5}>
                                                <div className="overflow-hidden">
                                                    {isArea && (<Area onClose={()=>setIsArea(false)}/>)}
                                                    {!isArea && (<EditPopup setIsArea={setIsArea} onClose={handleCloseEdit} id={item.id} />)}
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
                </>
            )}
        </div>
    );
}
