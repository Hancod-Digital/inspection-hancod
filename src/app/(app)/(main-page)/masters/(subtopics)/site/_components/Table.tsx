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

export default function EquipmentTable({searchValue}:{searchValue:string}) {
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

    const rearrangedData = subtopics
        ? [...subtopics].sort((a: any, b: any) => {
            const aMatch = a.site.toLowerCase().includes(searchValue.toLowerCase());
            const bMatch = b.site.toLowerCase().includes(searchValue.toLowerCase());
            if (aMatch && !bMatch) return -1;
            if (!aMatch && bMatch) return 1;
            return 0;
          })
        : [];

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
                            <TableHead className="py-4">Major Category</TableHead>
                            <TableHead className="py-4">Area</TableHead>
                            <TableHead className="py-4">Status</TableHead>
                            <TableHead className="py-4">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {rearrangedData.map((item: any, idx: number) => (
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
