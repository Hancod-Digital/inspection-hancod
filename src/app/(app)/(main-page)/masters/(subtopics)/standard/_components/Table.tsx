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

interface EquipmentData {
    slNo: number;
    standard: string;
    standardType: string;
    remarks: string;
    status: string;
}

import EditPopup from './EditPopup';
import DeleteIcon from '@/components/icons/DeleteIcon';
import EditIcon from '@/components/icons/EditIcon';

const equipmentData: EquipmentData[] = [
    {
        slNo: 1,
        standard: 'AISC-360-16',
        standardType: 'Non QP Footer',
        remarks: '',
        status: 'Active',
    },
    {
        slNo: 2,
        standard: 'AISC-360-16',
        standardType: 'Non QP Footer',
        remarks: 'Gin wheel',
        status: 'Active',
    },
    {
        slNo: 3,
        standard: 'AISC-360-16',
        standardType: 'Non QP Footer',
        remarks: 'Monorail',
        status: 'Active',
    },
    {
        slNo: 4,
        standard: 'AISC-360-16',
        standardType: 'Non QP Footer',
        remarks: '',
        status: 'Active',
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
                        <TableHead className="py-4 flex-[3]">Standard</TableHead>
                        <TableHead className="py-4 flex-[3]">Standard Type</TableHead>
                        <TableHead className="py-4 flex-[3]">Remarks</TableHead>
                        <TableHead className="py-4 flex-[2]">Status</TableHead>
                        <TableHead className="py-4 flex-[1]"></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {equipmentData.map((item) => (
                        <React.Fragment key={item.slNo}>
                            <TableRow className='flex'>
                                <TableCell className="py-4 flex-[1]">{item.slNo}</TableCell>
                                <TableCell className="py-4 flex-[3]">{item.standard}</TableCell>
                                <TableCell className="py-4 flex-[3]">{item.standardType}</TableCell>
                                <TableCell className="py-4 flex-[3]">{item.remarks}</TableCell>
                                <TableCell className="py-4 flex-[2]">{item.status}</TableCell>
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
                                        <TableCell colSpan={6}>
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
