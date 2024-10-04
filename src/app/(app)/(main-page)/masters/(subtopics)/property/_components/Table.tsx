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
    property: string;
    propertyType: string;
    status: string;
}

const equipmentData: EquipmentData[] = [
    {
        slNo: 1,
        property: 'Power Unit',
        propertyType: 'Annexure',
        status: 'Active',
    },
    {
        slNo: 2,
        property: 'Power Unit',
        propertyType: 'Annexure',
        status: 'Active',
    },
    {
        slNo: 3,
        property: 'Power Unit',
        propertyType: 'Annexure',
        status: 'Active',
    },
    {
        slNo: 4,
        property: 'Power Unit',
        propertyType: 'Annexure',
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
                        <TableHead className="py-4">Property</TableHead>
                        <TableHead className="py-4">Property Type</TableHead>
                        <TableHead className="py-4">Status</TableHead>
                        <TableHead className="py-4"></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {equipmentData.map((item,idx:number) => (
                        <React.Fragment key={idx+1}>
                            <TableRow>
                                <TableCell className="py-4">{idx+1}</TableCell>
                                <TableCell className="py-4">{item.property}</TableCell>
                                <TableCell className="py-4">{item.propertyType}</TableCell>
                                <TableCell className="py-4">{item.status}</TableCell>
                                <TableCell className="py-4">
                                    <div className="flex space-x-2">
                                        <button onClick={() => handleEditClick(idx+1)} className="text-red-500">
                                            <EditIcon />
                                        </button>
                                        <button className="text-red-500">
                                            <DeleteIcon />
                                        </button>
                                    </div>
                                </TableCell>
                            </TableRow>
                            <AnimatePresence>
                                {editingRow === idx+1 && (
                                    <motion.tr
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <TableCell colSpan={5}>
                                            <div className="overflow-hidden">
                                                <EditPopup onClose={handleCloseEdit} id={0} />
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
