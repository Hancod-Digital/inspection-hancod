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
import { PencilIcon, TrashIcon } from '@heroicons/react/outline'; // Assuming you're using heroicons

interface EquipmentData {
    slNo: number;
    thumbnail: string;
    status: string;
}

import EditPopup from './EditPopup';
import EditIcon from '@/components/icons/EditIcon';
import DeleteIcon from '@/components/icons/DeleteIcon';

const equipmentData: EquipmentData[] = [
    {
        slNo: 1,
        thumbnail: 'OFFSHORE',
        status: 'Inactive'
    },
    {
        slNo: 2,
        thumbnail: 'ONSHORE',
        status: 'Inactive'
    }
];

export default function EquipmentTable() {
    const [editingRow, setEditingRow] = useState<number | null>(null);

    const handleEditClick = (slNo: number) => {
        setEditingRow(slNo === editingRow ? null : slNo);
    };

    const handleCloseEdit = () => {
        setEditingRow(null);
    };

    return (
        <div className="px-8 py-3 bg-white w-[98%] mx-auto">
            <Table className="w-full">
                <TableHeader>
                    <TableRow className='flex justify-start'>
                        <TableHead className="py-4 flex-[1]">Sl. No.</TableHead>
                        <TableHead className="py-4 flex-[3]">Thumbnail</TableHead> {/* Increased width */}
                        <TableHead className="py-4 flex-[1]">Status</TableHead>
                        <TableHead className="py-4 flex-[1]"></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {equipmentData.map((item) => (
                        <React.Fragment key={item.slNo}>
                            <TableRow className='flex '>
                                <TableCell className="py-4 flex-[1]">{item.slNo}</TableCell>
                                <TableCell className="py-4 flex-[3]">{item.thumbnail}</TableCell> {/* Increased width */}
                                <TableCell className="py-4 flex-[1]">{item.status}</TableCell>
                                <TableCell className="py-4 flex-[1]">
                                    <div className="flex space-x-2">
                                        <button onClick={() => handleEditClick(item.slNo)} className="text-red-500">
                                            <EditIcon/>
                                        </button>
                                        <button className="text-red-500">
                                            <DeleteIcon/>
                                        </button>
                                    </div>
                                </TableCell>
                            </TableRow>
                            <AnimatePresence>
                                {editingRow === item.slNo && (
                                    <motion.tr
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <TableCell colSpan={4}>
                                            <div className="overflow-hidden">
                                                <EditPopup onClose={handleCloseEdit} />
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
