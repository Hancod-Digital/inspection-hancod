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
import DeleteDialogue from '@/components/ui/delete-dialog';
import { useSubtopic } from '@/context/SubtopicContext';
import { minorCategoryDataRange } from '@/lib/utils';

// Define the TypeScript interface for better type safety
 
export default function MinorCategory({searchValue}:{searchValue:string}) {
    const [editingRow, setEditingRow] = useState<number | null>(null);
    const { isLoading, error, getMergedData, deleteRecord } = useSubtopic();
    const [minorCategories, setMinorCategories] = useState<any>([]);

    useEffect(() => {
        async function fetchMinorCategories() {
            try {
                const data = await getMergedData(minorCategoryDataRange, 'minor_category');
                console.log(data);
                
                setMinorCategories(data);
            } catch (error) {
                console.error("Error fetching minor categories:", error);
            }
        }

        fetchMinorCategories();
    }, [getMergedData]);

    const handleEditClick = (slNo: number) => {
        setEditingRow(slNo === editingRow ? null : slNo);
    };

    const handleCloseEdit = () => {
        setEditingRow(null);
    };

    const handleDeleteClick = (id: number) => {
        deleteRecord(id);
    };

    const rearrangedData = minorCategories
    ? [...minorCategories].sort((a:any, b:any) => {
        const aMatch = a.minor_category.toLowerCase().includes(searchValue.toLowerCase());
        const bMatch = b.minor_category.toLowerCase().includes(searchValue.toLowerCase());
        if (aMatch && !bMatch) return -1;
        if (!aMatch && bMatch) return 1;
        return 0;
      })
    : [];

    return (
        <div className="px-8 py-3 bg-white w-[98%] mx-auto">
            {isLoading ? (
                <div>Loading...</div>
            ) : error ? (
                <div>Error loading data</div>
            ) : (
                <Table className="w-full">
                    <TableHeader>
                        <TableRow>
                            <TableHead className="py-4">Sl. No.</TableHead>
                            <TableHead className="py-4">Minor Category</TableHead>
                            <TableHead className="py-4">Major Category</TableHead>
                            <TableHead className="py-4">Standard</TableHead>
                            <TableHead className="py-4">Status</TableHead>
                            <TableHead className="py-4">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {rearrangedData.map((item:any, idx:number) => (
                            <React.Fragment key={item.id}>
                                <TableRow>
                                    <TableCell className="py-4">{idx + 1}</TableCell>
                                    <TableCell className="py-4">{item?.minor_category}</TableCell>
                                    <TableCell className="py-4">{item?.major_category?.major_category}</TableCell>
                                    <TableCell className="py-4">{item?.standard?.standard}</TableCell>
                                    <TableCell className="py-4">{item?.status}</TableCell>
                                    <TableCell className="py-4">
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => handleEditClick(idx + 1)}
                                                className="text-red-500"
                                            >
                                                <EditIcon />
                                            </button>
                                            <DeleteDialogue
                                                onConfirm={() => handleDeleteClick(item.id)}
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
                                            <TableCell colSpan={6}>
                                                <div className="overflow-hidden">
                                                    <EditPopup onClose={handleCloseEdit} id={item.id} />
                                                </div>
                                            </TableCell>
                                        </motion.tr>
                                    )}
                                </AnimatePresence>
                            </React.Fragment>
                        ))}
                    </TableBody>
                </Table>
            )}
        </div>
    );
}
