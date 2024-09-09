'use client';
import React, { useState } from 'react';
import { PencilIcon, TrashIcon } from '@heroicons/react/outline';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { motion, AnimatePresence } from 'framer-motion';
import JobDetailsForm from './EditPopup';

interface JobData {
  slNo: number;
  jobNumber: string;
  clientName: string;
  contactNumber: string;
  surveyor: string;
  location: string;
  equipmentDetails: string;
}

const jobData: JobData[] = [
  {
    slNo: 1,
    jobNumber: '45885',
    clientName: 'Riyas V Bava',
    contactNumber: '699418785',
    surveyor: 'Gireesh',
    location: 'Doha, Qatar',
    equipmentDetails: 'Container',
  },
  // Add more rows as needed
];

export default function JobTable() {
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
          <TableRow className="flex justify-start">
            <TableHead className="py-4 flex-[1]">Sl. No.</TableHead>
            <TableHead className="py-4 flex-[2]">Job Number</TableHead>
            <TableHead className="py-4 flex-[3]">Client Name</TableHead>
            <TableHead className="py-4 flex-[3]">Contact Number</TableHead>
            <TableHead className="py-4 flex-[2]">Surveyor</TableHead>
            <TableHead className="py-4 flex-[2]">Location</TableHead>
            <TableHead className="py-4 flex-[2]">Equipment Details</TableHead>
            <TableHead className="py-4 flex-[1]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {jobData.map((item) => (
            <React.Fragment key={item.slNo}>
              <TableRow className="flex">
                <TableCell className="py-4 flex-[1]">{item.slNo}</TableCell>
                <TableCell className="py-4 flex-[2]">{item.jobNumber}</TableCell>
                <TableCell className="py-4 flex-[3]">{item.clientName}</TableCell>
                <TableCell className="py-4 flex-[3]">{item.contactNumber}</TableCell>
                <TableCell className="py-4 flex-[2]">{item.surveyor}</TableCell>
                <TableCell className="py-4 flex-[2]">{item.location}</TableCell>
                <TableCell className="py-4 flex-[2]">{item.equipmentDetails}</TableCell>
                <TableCell className="py-4 flex-[1]">
                  <div className="flex gap-4">
                    <PencilIcon
                      className="w-5 h-5 text-gray-500 cursor-pointer"
                      onClick={() => handleEditClick(item.slNo)}
                    />
                    <TrashIcon className="w-5 h-5 text-gray-500 cursor-pointer" />
                  </div>
                </TableCell>
              </TableRow>
              {editingRow === item.slNo && (
                <TableRow>
                  <TableCell colSpan={7} className="p-4">
                    <AnimatePresence>
                      <JobDetailsForm onClose={handleCloseEdit} />
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
