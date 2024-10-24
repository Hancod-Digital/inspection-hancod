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
import DeleteDialogue from '@/components/ui/delete-dialog';
import { useSubtopic } from '@/context/SubtopicContext';

export default function EquipmentTable({ searchValue }: { searchValue: string }) {
    const [editingRow, setEditingRow] = useState<number | null>(null);
    const { deleteRecord, data } = useSubtopic();

    const handleEditClick = (id: number) => {
        setEditingRow(id === editingRow ? null : id);
    };

    const handleCloseEdit = () => {
        setEditingRow(null);
    };

    const rearrangedData = data
        ? [...data].sort((a, b) => {
            const aMatch = a.property.toLowerCase().includes(searchValue.toLowerCase());
            const bMatch = b.property.toLowerCase().includes(searchValue.toLowerCase());
            if (aMatch && !bMatch) return -1;
            if (!aMatch && bMatch) return 1;
            return 0;
        })
        : [];

    return (
        <div className="px-8 py-3 bg-white w-[98%] mx-auto">
            <Table className="w-full">
                <TableHeader>
                    <TableRow>
                        <TableHead className="py-4">Sl. No.</TableHead>
                        <TableHead className="py-4">Property</TableHead>
                        <TableHead className="py-4">Property Type</TableHead>
                        <TableHead className="py-4">Status</TableHead>
                        <TableHead className="py-4"></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {rearrangedData.map((item, idx: number) => (
                        <React.Fragment key={item.id}>
                            <TableRow>
                                <TableCell className="py-4">{idx + 1}</TableCell>
                                <TableCell className="py-4">{item.property}</TableCell>
                                <TableCell className="py-4">{item.property_type}</TableCell>
                                <TableCell className="py-4">{item.status}</TableCell>
                                <TableCell className="py-4">
                                    <div className="flex space-x-2">
                                        <button onClick={() => handleEditClick(item.id)} className="text-red-500">
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
                                {editingRow === item.id && (
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
        </div>
    );
}
