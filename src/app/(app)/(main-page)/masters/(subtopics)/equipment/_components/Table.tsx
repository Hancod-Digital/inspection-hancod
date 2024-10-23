'use client';
import React, { useEffect, useState } from 'react';
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
import { equipmentDataRange, majorCategoryDataRange } from '@/lib/utils';
import DeleteDialogue from '@/components/ui/delete-dialog';

export default function Component({searchValue}:{searchValue:string}) {
    const [editingRow, setEditingRow] = useState<number | null>(null);

    const { isLoading, error, getAllSingleSubtopic, getMergedData, deleteRecord, data } = useSubtopic();
    const [subtopics, setSubtopics] = useState([]);
    const [selectedItem, setSelectedItem] = useState<any>(null);

    const handleEditClick = (slNo: number) => {
        setEditingRow(slNo === editingRow ? null : slNo);
    };

    const handleCloseEdit = () => {
        setEditingRow(null);
    };
    useEffect(() => {
        async function fetchSubtopics() {
            try {
                const equipment_type = await getMergedData(equipmentDataRange, 'equipment');
                setSubtopics(equipment_type);
            } catch (error) {
                console.error("Error fetching subtopics:", error);
            }
        }

        fetchSubtopics();
    }, [getMergedData]);
    const rearrangedData = subtopics
    ? [...subtopics].sort((a:any, b:any) => {
        const aMatch = a.title.toLowerCase().includes(searchValue.toLowerCase());
        const bMatch = b.title.toLowerCase().includes(searchValue.toLowerCase());
        if (aMatch && !bMatch) return -1;
        if (!aMatch && bMatch) return 1;
        return 0;
      })
    : [];
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
                    {rearrangedData.map((item: any, idx: number) => (
                        <React.Fragment key={idx + 1}>
                            <TableRow>
                                <TableCell className="py-4">{idx + 1}</TableCell>
                                <TableCell className="py-4">{item?.equipment_no}</TableCell>
                                <TableCell className="py-4">{item?.title}</TableCell>
                                <TableCell className="py-4">{item?.equipment_type?.equipment_type}</TableCell>{/** */}
                                <TableCell className="py-4">{item?.last_thorough_date}</TableCell>
                                <TableCell className="py-4">{item?.next_thorough_date}</TableCell>
                                <TableCell className="py-4">{item?.last_test_date}</TableCell>
                                <TableCell className="py-4">{item?.status}</TableCell>
                                <TableCell className="py-4">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <button>
                                                <ActionButtonIcon />
                                            </button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent>
                                            <DropdownMenuItem onClick={() => handleEditClick(idx + 1)}>
                                                Edit
                                            </DropdownMenuItem>
                                            <DeleteDialogue
                                                onConfirm={async () => await deleteRecord(item.id)}
                                                triggerButton={
                                                    <DropdownMenuItem 
                                                        onSelect={(event) => event.preventDefault()}
                                                    >
                                                        Delete
                                                    </DropdownMenuItem>
                                                }
                                            />
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
