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
import { majorCategoryDataRange } from '@/lib/utils';

export default function EquipmentTable({searchValue}:{searchValue:string}) {
    const [editingRow, setEditingRow] = useState<number | null>(null);
    const { isLoading, error, getAllSingleSubtopic, getMergedData,deleteRecord } = useSubtopic();
    const [subtopics, setSubtopics] = useState([]);
    const [selectedItem, setSelectedItem] = useState<any>(null);

    useEffect(() => {
        async function fetchSubtopics() {
            try {
                const major_category = await getMergedData(majorCategoryDataRange, 'major_category');
                setSubtopics(major_category);
            } catch (error) {
                console.error("Error fetching subtopics:", error);
            }
        }

        fetchSubtopics();
    }, [getMergedData]);

    const handleEditClick = (slNo: number) => {
        setEditingRow(slNo === editingRow ? null : slNo);
    };

    const handleCloseEdit = () => {
        setEditingRow(null);
    };

    const rearrangedData = subtopics?.filter((item:any)=>item?.major_category?.toLowerCase()?.includes(searchValue?.toLowerCase()))
    const { currentPage, pageSize, totalPages, currentData, handlePreviousPage, handleNextPage, goToPage,setCurrentPage } = usePagination(rearrangedData);
     

    return (
        <div className="px-8 py-3 bg-white w-[98%] mx-auto  ">
            {isLoading ? (
                <div>Loading...</div>
            ) : error ? (
                <div>Error loading data</div>
            ) : (
                <>
                    <Table className="w-full">
                        <TableHeader>
                            <TableRow>
                                <TableHead className="py-4">Sl. No.</TableHead>
                                <TableHead className="py-4">Major Category</TableHead>
                                <TableHead className="py-4">Equipment Type</TableHead>
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
                            currentData?.map((item: any, idx: number) => (
                                <React.Fragment key={idx + 1}>
                                    <TableRow>
                                        <TableCell className="py-4">{(currentPage - 1) * pageSize + idx + 1}</TableCell>
                                        <TableCell className="py-4">{item?.major_category}</TableCell>
                                        <TableCell className="py-4">{item?.equipment_type?.equipment_type}</TableCell>
                                        <TableCell className="py-4">{item?.status}</TableCell>
                                        <TableCell className="py-4">
                                            <div className="flex space-x-2">
                                                <button onClick={() => handleEditClick(idx + 1)} className="text-red-500">
                                                    <EditIcon />
                                                </button>
                                                <DeleteAlertDialog
                                                    onConfirm={async()=>await deleteRecord(item?.id)}
                                                    triggerButton={
                                                        
                                                        <button  className="text-red-500">
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
                            {subtopics && subtopics.length > 6 && (
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
                </>
            )}
        </div>
    );
}



import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { PaginationDemo } from '@/components/pagination-demo';
import usePagination from '@/hooks/usePagination';

interface DeleteAlertDialogProps {
    onConfirm: () => void;
    triggerButton: React.ReactNode;
}

const DeleteAlertDialog: React.FC<DeleteAlertDialogProps> = ({ onConfirm, triggerButton }) => {
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>{triggerButton}</AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the item.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction className='hover:bg-white hover:border hover:border-primary border hover:text-primary' onClick={onConfirm}>Delete</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

 