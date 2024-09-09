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

interface SurveyorData {
    slNo: number;
    surveyor: string;
    qualification: string;
    code: string;
    status: string;
    user: string;
}

import SurveyorDetailsForm from './EditPopup';
import EditIcon from '@/components/icons/EditIcon';
import DeleteIcon from '@/components/icons/DeleteIcon';

const surveyorData: SurveyorData[] = [
    {
        slNo: 1,
        surveyor: 'Prasanth Varrier',
        qualification: 'MBA',
        code: '198',
        status: 'Active',
        user: 'Prasanth',
    },
    {
        slNo: 2,
        surveyor: 'Prasanth Varrier',
        qualification: 'MBA',
        code: '198',
        status: 'Active',
        user: 'Prasanth',
    },
];

export default function SurveyorTable() {
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
                        <TableHead className="py-4 flex-[2]">Surveyor</TableHead>
                        <TableHead className="py-4 flex-[2]">Qualification</TableHead>
                        <TableHead className="py-4 flex-[2]">Code</TableHead>
                        <TableHead className="py-4 flex-[2]">Status</TableHead>
                        <TableHead className="py-4 flex-[2]">User</TableHead>
                        <TableHead className="py-4 flex-[1]"></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {surveyorData.map((item) => (
                        <React.Fragment key={item.slNo}>
                            <TableRow className='flex'>
                                <TableCell className="py-4 flex-[1]">{item.slNo}</TableCell>
                                <TableCell className="py-4 flex-[2]">{item.surveyor}</TableCell>
                                <TableCell className="py-4 flex-[2]">{item.qualification}</TableCell>
                                <TableCell className="py-4 flex-[2]">{item.code}</TableCell>
                                <TableCell className="py-4 flex-[2]">{item.status}</TableCell>
                                <TableCell className="py-4 flex-[2]">{item.user}</TableCell>
                                <TableCell className="py-4 flex-[1]">
                                    <div className="flex space-x-2">
                                        <button onClick={() => handleEditClick(item.slNo)} className="text-red-500">
                                            <EditIcon/>
                                        </button>
                                        <button className="text-red-500">
                                            <DeleteIcon />
                                        </button>
                                    </div>
                                </TableCell>
                            </TableRow>
                            {editingRow === item.slNo && (
                                <TableRow>
                                    <TableCell colSpan={7} className="p-4">
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
