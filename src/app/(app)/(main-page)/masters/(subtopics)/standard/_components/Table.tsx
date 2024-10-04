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
import { PencilIcon, TrashIcon } from '@heroicons/react/outline';

import EditPopup from './EditPopup';
import DeleteIcon from '@/components/icons/DeleteIcon';
import EditIcon from '@/components/icons/EditIcon';
import { useSubtopic } from '@/context/SubtopicContext';

export default function EquipmentTable() {
    const [editingRow, setEditingRow] = useState<number | null>(null);
    const { data, isLoading, error } = useSubtopic();

    const handleEditClick = (idx: number) => {
        setEditingRow(idx === editingRow ? null : idx);
    };

    const handleCloseEdit = () => {
        setEditingRow(null);
    };

    return (
        <div className="px-8 py-3 bg-white w-[98%] mx-auto">
             
                <Table className="w-full">
                    <TableHeader>
                        <TableRow>
                            <TableHead className="py-4">Sl. No.</TableHead>
                            <TableHead className="py-4">Standard</TableHead>
                            <TableHead className="py-4">Standard Type</TableHead>
                            <TableHead className="py-4">Remarks</TableHead>
                            <TableHead className="py-4">Status</TableHead>
                            <TableHead className="py-4">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data?.map((item, idx) => (
                            <React.Fragment key={idx + 1}>
                                <TableRow>
                                    <TableCell className="py-4">{idx + 1}</TableCell>
                                    <TableCell className="py-4">{item.standard}</TableCell>
                                    <TableCell className="py-4">{item.standard_type}</TableCell>
                                    <TableCell className="py-4">{item.remarks}</TableCell>
                                    <TableCell className="py-4">{item.status}</TableCell>
                                    <TableCell className="py-4">
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => handleEditClick(idx + 1)}
                                                className="text-red-500"
                                            >
                                                <EditIcon />
                                            </button>
                                            <button className="text-red-500">
                                                <DeleteIcon />
                                            </button>
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
             
        </div>
    );
}
