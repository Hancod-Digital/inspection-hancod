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

interface AuthorityData {
    slNo: number;
    authority: string;
    designation: string;
    status: string;
}

import SurveyorDetailsForm from './EditPopup';
import EditIcon from '@/components/icons/EditIcon';
import DeleteIcon from '@/components/icons/DeleteIcon';

const authorityData: AuthorityData[] = [
    {
        slNo: 1,
        authority: 'Jerin Thomas',
        designation: 'Authorized Signatory',
        status: 'Active',
    },
    {
        slNo: 2,
        authority: 'Jerin Thomas',
        designation: 'Authorized Signatory',
        status: 'Active',
    },
];

export default function AuthorityTable() {
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
                        <TableHead className="py-4 flex-[3]">Authority</TableHead>
                        <TableHead className="py-4 flex-[3]">Designation</TableHead>
                        <TableHead className="py-4 flex-[2]">Status</TableHead>
                        <TableHead className="py-4 flex-[1]"></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {authorityData.map((item) => (
                        <React.Fragment key={item.slNo}>
                            <TableRow className='flex'>
                                <TableCell className="py-4 flex-[1]">{item.slNo}</TableCell>
                                <TableCell className="py-4 flex-[3]">{item.authority}</TableCell>
                                <TableCell className="py-4 flex-[3]">{item.designation}</TableCell>
                                <TableCell className="py-4 flex-[2]">{item.status}</TableCell>
                                <TableCell className="py-4 flex-[1]">
                                    <div className="flex ">
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
                                    <TableCell colSpan={7} className="">
                                        <AnimatePresence>
                                            <SurveyorDetailsForm onClose={handleCloseEdit} />
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
