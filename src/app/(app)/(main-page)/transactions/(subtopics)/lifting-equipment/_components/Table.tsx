// components/EquipmentTable.tsx

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
} from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import ActionButtonIcon from '@/components/icons/ActionButtonIcon';
import EditPopup from './EditPopup';
import { useSubtopic } from '@/context/SubtopicContext';

export default function EquipmentTable() {
  const [editingRow, setEditingRow] = useState<number | null>(null);
  const { data, isLoading, error,  } = useSubtopic();

  const handleEditClick = (id: number) => {
    setEditingRow(id === editingRow ? null : id);
  };

  const handleCloseEdit = () => {
    setEditingRow(null);
  };

  const handleDeleteClick = async (id: number) => {
    if (confirm('Are you sure you want to delete this record?')) {
      try {
        // await deleteRecord(id);
      } catch (error) {
        console.error('Error deleting record:', error);
        // Optionally, display an error message to the user
      }
    }
  };

  if (isLoading) {
    return <p className="text-center py-10">Loading...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500 py-10">Error loading data.</p>;
  }

  return (
    <div className="px-8 py-3 bg-white w-[98%] mx-auto">
      <Table className="w-full">
        <TableHeader>
          <TableRow>
            <TableHead className="py-4">Sl. No.</TableHead>
            <TableHead className="py-4">Equipment ID</TableHead>
            <TableHead className="py-4">Title</TableHead>
            <TableHead className="py-4">Equipment Type</TableHead>
            <TableHead className="py-4">Last Thorough Date</TableHead>
            <TableHead className="py-4">Next Thorough Date</TableHead>
            <TableHead className="py-4">Inspection Date</TableHead>
            <TableHead className="py-4">Status</TableHead>
            <TableHead className="py-4">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data && data.length > 0 ? (
            data?.map((item, idx) => (
              <React.Fragment key={item.id}>
                <TableRow>
                  <TableCell className="py-4">{idx + 1}</TableCell>
                  <TableCell className="py-4">{item?.equipmentNo}</TableCell>
                  <TableCell className="py-4">{item?.title}</TableCell>
                  <TableCell className="py-4">{item?.equipmentType}</TableCell>
                  <TableCell className="py-4">{item?.lastThoroughDate}</TableCell>
                  <TableCell className="py-4">{item?.nextThoroughDate}</TableCell>
                  <TableCell className="py-4">{item?.inspectionDate}</TableCell>
                  <TableCell
                    className={`py-4 ${
                      item?.status?.toLowerCase() === 'approved'
                        ? 'text-green-500'
                        : 'text-red-500'
                    }`}
                  >
                    {item?.status}
                  </TableCell>
                  <TableCell className="py-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button>
                          <ActionButtonIcon />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => handleEditClick(item.id)}>
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDeleteClick(item.id)}>
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
                <AnimatePresence>
                  {editingRow === item.id && (
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
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={9} className="p-2 text-center text-gray-500">
                No data to display
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
