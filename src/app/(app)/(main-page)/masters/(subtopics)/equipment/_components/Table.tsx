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
import ActionButtonIcon from '@/components/icons/ActionButtonIcon';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import EditPopup from './EditPopup';
import { useSubtopic } from '@/context/SubtopicContext';

export default function Component() {
    const [editingRow, setEditingRow] = useState<number | null>(null);
    const { data, isLoading, error } = useSubtopic();

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
                        <TableHead>Sl. No.</TableHead>
                        <TableHead className="py-4">Equipment ID</TableHead>
                        <TableHead className="py-4">Title</TableHead>
                        <TableHead className="py-4">Equipment Type</TableHead>
                        <TableHead className="py-4">Last Through Date</TableHead>
                        <TableHead className="py-4">Next Through Date</TableHead>
                        <TableHead className="py-4">Last Test Date</TableHead>
                        <TableHead className="py-4">Status</TableHead>
                        <TableHead className="py-4">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data?.map((item, idx) => (
                        <React.Fragment key={idx + 1}>
                            <TableRow>
                                <TableCell className="py-4">{idx + 1}</TableCell>
                                <TableCell className="py-4">{item?.equipmentID}</TableCell>
                                <TableCell className="py-4">{item?.title}</TableCell>
                                <TableCell className="py-4">{item?.equipmentType}</TableCell>
                                <TableCell className="py-4">{item?.lastThroughDate}</TableCell>
                                <TableCell className="py-4">{item?.nextThroughDate}</TableCell>
                                <TableCell className="py-4">{item?.lastTestDate}</TableCell>
                                <TableCell className="py-4">{item?.status}</TableCell>
                                <TableCell className="py-4">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <button>
                                                <ActionButtonIcon />
                                            </button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent>
                                            <DropdownMenuItem onClick={() => handleEditClick(idx + 1)}>Edit</DropdownMenuItem>
                                            <DropdownMenuItem>Delete</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
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
                                        <TableCell colSpan={9}>
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
