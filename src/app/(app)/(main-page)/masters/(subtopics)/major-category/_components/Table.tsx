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

interface EquipmentData {
    slNo: number;
    majorCategory: string;
    equipmentType: string;
    status: string;
}

const equipmentData: EquipmentData[] = [
    {
        slNo: 1,
        majorCategory: 'Lift cart',
        equipmentType: 'Lifting Equipment',
        status: 'Active',
    },
    {
        slNo: 2,
        majorCategory: 'Industrial Truck',
        equipmentType: 'Lifting Equipment',
        status: 'Active',
    },
    {
        slNo: 3,
        majorCategory: 'Hydraulic Cylinder',
        equipmentType: 'Lifting Equipment',
        status: 'Active',
    },
    {
        slNo: 4,
        majorCategory: 'Beam Trolley',
        equipmentType: 'Lifting Equipment',
        status: 'Active',
    },
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
                    <TableRow>
                        <TableHead className="py-4">Sl. No.</TableHead>
                        <TableHead className="py-4">Major Category</TableHead>
                        <TableHead className="py-4">Equipment Type</TableHead>
                        <TableHead className="py-4">Status</TableHead>
                        <TableHead className="py-4"></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {equipmentData.map((item) => (
                        <React.Fragment key={item.slNo}>
                            <TableRow>
                                <TableCell className="py-4">{item.slNo}</TableCell>
                                <TableCell className="py-4">{item.majorCategory}</TableCell>
                                <TableCell className="py-4">{item.equipmentType}</TableCell>
                                <TableCell className="py-4">{item.status}</TableCell>
                                <TableCell className="py-4">
                                    <div className="flex space-x-2">
                                        <button onClick={() => handleEditClick(item.slNo)} className="text-red-500">
                                            <EditIcon />
                                        </button>
                                        <button className="text-red-500">
                                            <DeleteIcon />
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
                                        <TableCell colSpan={5}>
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
