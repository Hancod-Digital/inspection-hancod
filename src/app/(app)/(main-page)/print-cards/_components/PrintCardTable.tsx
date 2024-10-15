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
import EditIcon from '@/components/icons/EditIcon';
import DeleteIcon from '@/components/icons/DeleteIcon';
import { Button } from '@/components/ui/button';
import { makeApiCall } from '@/lib/apicaller';
import { StudentService } from '@/services/api/students-service';
import { ToastVariant, toastWithTimeout } from '@/components/ui/use-toast';

export default function PrintCardTable({data,changed}:{data:any,changed:boolean}) {
    const [editingRow, setEditingRow] = useState<number | null>(null);
   

    const staticData = [
        {
            id: 5491,
            name: 'Ajad Miya Mansuri',
            address: 'Z',
            designation: 'Work at Height',
            addedBy: 'Munsheer',
            idNumber: '30035613413',
            cardNumber: 'QB-OPR-24-136042',
            modelLevel: 'Safety Training',
            company: 'Abraj Qatar Group',
            issueDate: '16-09-2024',
            validUntil: '15-09-2026',
            qrImage: '/path/to/qr.png',
        },
        // Add more rows here if needed
    ];

    const handleEditClick = (item: any) => {
        const imageUrl = item?.card_url;
    
        // Open a new window
        const printWindow = window.open('', '_blank', 'width=600,height=600');
    
        if (printWindow) {
          printWindow.document.open();
          printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
              <title>Print Image</title>
              <style>
                body, html {
                  margin: 0;
                  padding: 0;
                  height: 100%;
                }
                img {
                  width: 100%;
                  height: auto;
                }
              </style>
            </head>
            <body>
              <img src="${imageUrl}" onload="window.print(); window.close();" />
            </body>
            </html>
          `);
          printWindow.document.close();
        } else {
          alert('Please allow pop-ups for this website to print the image.');
        }
      };

    const handleCloseEdit = () => {
        setEditingRow(null);
    };

    return (
        <div className="px-8 py-3 bg-white w-[98%] mx-auto">
            <Table className="w-full">
                <TableHeader>
                    <TableRow>
                        <TableHead className="py-4">ID</TableHead>
                        <TableHead className="py-4">Name</TableHead>
                        <TableHead className="py-4">Added_By</TableHead>
                        <TableHead className="py-4">Card/Model/Level</TableHead>
                        <TableHead className="py-4">QR Image</TableHead>
                        <TableHead className="py-4">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data?.map((item: any, idx: number) => (
                        <React.Fragment key={idx + 1}>
                            <TableRow>
                                <TableCell className="py-4">{idx}</TableCell>
                                <TableCell className="py-4">
                                    {item?.name}
                                    <div>Address: {item?.address}</div>
                                    <div>Designation: {item?.designation}</div>
                                </TableCell>
                                <TableCell className="py-4">{item?.added_by}</TableCell>
                                <TableCell className="py-4">
                                    <div>ID No: {item?.id_number}</div>
                                    <div>Card No: {item?.card_number}</div>
                                    <div>Model/Level: {item?.model_level}</div>
                                    <div>Company: {item?.company}</div>
                                    <div>Issued on: {item?.issued_on}</div>
                                    <div>Valid Until: {item?.valid_untill}</div>
                                </TableCell>
                                <TableCell className="py-4">
                                    <img src={item?.card_qr_url} alt="QR code" className="w-16 h-16" />
                                </TableCell>
                                <TableCell className="py-4">
                                    <div className="flex space-x-2">
                                    <button onClick={() => handleEditClick(item)} className="text-red-500">
                    <EditIcon />
                  </button>
                                        <button className="text-red-500">
                                            <DeleteIcon />
                                        </button>
                                    </div>
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
                                        <TableCell colSpan={6}>
                                            <div className="overflow-hidden">
                                                {/* Insert the EditPopup component with relevant props here */}
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
