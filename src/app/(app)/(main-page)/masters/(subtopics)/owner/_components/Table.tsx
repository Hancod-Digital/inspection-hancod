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

interface OwnerData {
    slNo: number;
    owner: string;
    address: string;
    code: string;
    status: string;
}

import OwnerDetailsForm from './EditPopup';
import EditIcon from '@/components/icons/EditIcon';
import DeleteIcon from '@/components/icons/DeleteIcon';

const ownerData: OwnerData[] = [
    {
        slNo: 1,
        owner: 'DOLPHIN ENERGY LIMITED',
        address: 'Doha, Qatar',
        code: '198',
        status: 'Active',
    },
    {
        slNo: 2,
        owner: 'DOLPHIN ENERGY LIMITED',
        address: 'Doha, Qatar',
        code: '198',
        status: 'Active',
    }
];

export default function OwnerTable() {
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
                        <TableHead className="py-4 flex-[3]">Owner</TableHead>
                        <TableHead className="py-4 flex-[3]">Address</TableHead>
                        <TableHead className="py-4 flex-[2]">Code</TableHead>
                        <TableHead className="py-4 flex-[2]">Status</TableHead>
                        <TableHead className="py-4 flex-[1]"></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {ownerData.map((item) => (
                        <React.Fragment key={item.slNo}>
                            <TableRow className='flex'>
                                <TableCell className="py-4 flex-[1]">{item.slNo}</TableCell>
                                <TableCell className="py-4 flex-[3]">{item.owner}</TableCell>
                                <TableCell className="py-4 flex-[3]">{item.address}</TableCell>
                                <TableCell className="py-4 flex-[2]">{item.code}</TableCell>
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
                            {editingRow === item.slNo && (
                                <TableRow>
                                    <TableCell colSpan={6} className="p-0">
                                        <AnimatePresence>
                                            <OwnerDetailsForm onClose={handleCloseEdit} />
                                        </AnimatePresence>
                                    </TableCell>
                                </TableRow>
                            )}
                        </React.Fragment>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
