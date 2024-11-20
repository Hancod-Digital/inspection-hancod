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
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import ActionButtonIcon from '@/components/icons/ActionButtonIcon';
import EditPopup from './EditPopup' 
interface EquipmentData {
    slNo: number;
    equipmentID: string;
    title: string;
    equipmentType: string;
    lastThroughDate: string;
    nextTestExam: string;
    status: string;
}

const equipmentData: EquipmentData[] = [
    {
        slNo: 1,
        equipmentID: 'K 3527',
        title: 'SWIVEL LOAD RING',
        equipmentType: 'Lifting Gear',
        lastThroughDate: '05-08-2023',
        nextTestExam: '05-08-2023',
        status: 'Pending',
    },
    {
        slNo: 2,
        equipmentID: 'K 3527',
        title: 'SWIVEL LOAD RING',
        equipmentType: 'Lifting Gear',
        lastThroughDate: '05-08-2023',
        nextTestExam: '05-08-2023',
        status: 'Pending',
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
                    <TableRow className='flex justify-start'>
                        <TableHead className="py-4 flex-[1]">Sl. No.</TableHead>
                        <TableHead className="py-4 flex-[1]">Equipment ID</TableHead>
                        <TableHead className="py-4 flex-[2]">Title</TableHead>
                        <TableHead className="py-4 flex-[1]">Equipment Type</TableHead>
                        <TableHead className="py-4 flex-[1]">Inspection Date</TableHead>
                        <TableHead className="py-4 flex-[1]">Next Test Exam</TableHead>
                        <TableHead className="py-4 flex-[1]">Result</TableHead>
                        <TableHead className="py-4 flex-[1]"></TableHead>
                        <TableHead className="py-4 flex-[1]"></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {equipmentData?.map((item:any) => (
                        <React.Fragment key={item?.slNo}>
                            <TableRow className='flex'>
                                <TableCell className="py-4 flex-[1]">{item?.slNo}</TableCell>
                                <TableCell className="py-4 flex-[1]">{item?.equipmentID}</TableCell>
                                <TableCell className="py-4 flex-[2]">{item?.title}</TableCell>
                                <TableCell className="py-4 flex-[1]">{item?.equipmentType}</TableCell>
                                <TableCell className="py-4 flex-[1]">{item?.lastThroughDate}</TableCell>
                                
                                <TableCell className="py-4 flex-[1]">{item?.nextTestExam}</TableCell>
                                <TableCell className="py-4 flex-[1] bg-blue-500">{item?.result}</TableCell>
                                
                                <TableCell className={`py-4 flex-[1] ${item?.status === 'Pending' ? 'text-orange-500' : 'text-green-500'}`}>
                                    {item?.status}
                                </TableCell>
                                <TableCell className="py-4 flex-[1]">
                                <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <button>
                                                <ActionButtonIcon />
                                            </button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent>
                                            <DropdownMenuItem onClick={() => handleEditClick(item?.slNo)}>Edit</DropdownMenuItem>
                                            <DropdownMenuItem>Delete</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
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
                                        <EditPopup onClose={handleCloseEdit} />
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
