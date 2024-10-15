'use client';
import React, { useCallback, useEffect, useState } from 'react';
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
import { makeApiCall } from '@/lib/apicaller';
import { StudentService } from '@/services/api/students-service';
import EditPopup from './EditPopup';
import { ToastVariant, toastWithTimeout } from '@/components/ui/use-toast';
import QRCode from 'qrcode';
import { UserService } from '@/services/api/user-service';
import { toPng } from 'html-to-image';

export default function EquipmentTable({ data, setChanged,changed }:{data:any,setChanged:any,changed:boolean}) {
    const [editingRow, setEditingRow] = useState<any>(null);
    

 

    const handleEditClick = (slNo: number) => {
        setEditingRow(slNo === editingRow ? null : slNo!);
    };

    const handleCloseEdit = () => {
        setEditingRow(null);
    };

    const generateQr = async (id: number, name: any) => {
        // Create an HTML element with the student's name
        const htmlElement = document.createElement('div');
        htmlElement.style.width = '400px';
        htmlElement.style.height = '200px';
        htmlElement.style.display = 'flex';
        htmlElement.style.alignItems = 'center';
        htmlElement.style.justifyContent = 'center';
        htmlElement.style.backgroundColor = '#f0f0f0';
        htmlElement.innerHTML = `<h1>${name}</h1>`;

        // Append the element to the body (necessary for html-to-image)
        document.body.appendChild(htmlElement);

        try {
            // Convert the HTML element to an image (Data URL)
            const dataUrl = await toPng(htmlElement);

            // Remove the temporary element
            document.body.removeChild(htmlElement);

            // Convert Data URL to Blob
            const imageBlob = dataURLtoBlob(dataUrl);

            // Upload the card image and get its URL
            const cardImageUrl = await uploadImage(imageBlob);

            if (cardImageUrl) {
                // Update the student's card_url in the database
                await makeApiCall(
                    () => new StudentService().updateStudentCardUrl(id, cardImageUrl),
                    {
                        afterSuccess: (data: any) => {
                            console.log('Card image URL updated:', data);
                        },
                    }
                );

                // Now generate a QR code that points to the card image URL
                const qrDataUrl = await QRCode.toDataURL(cardImageUrl, {
                    width: 300,
                    errorCorrectionLevel: 'H',
                });

                // Convert QR code Data URL to Blob
                const qrImageBlob = dataURLtoBlob(qrDataUrl);

                // Upload the QR code image and get its URL
                const qrImageUrl = await uploadImage(qrImageBlob);

                if (qrImageUrl) {
                    // Update the student's card_qr_url in the database
                    await makeApiCall(
                        () => new StudentService().updateStudentQRUrl(id, qrImageUrl),
                        {
                            afterSuccess: (data: any) => {
                                console.log('QR code image URL updated:', data);
                            },
                        }
                    );

                    setChanged(!changed)
                    toastWithTimeout(ToastVariant.Success, "QR code created");
                } else {
                    toastWithTimeout(ToastVariant.Error, "Failed to upload QR image.");
                }
            } else {
                toastWithTimeout(ToastVariant.Error, "Failed to upload card image.");
            }
        } catch (error) {
            console.error("Error generating QR code:", error);
            toastWithTimeout(ToastVariant.Error, "An Error Occurred");
        } finally {
            // Ensure the temporary element is removed
            if (document.body.contains(htmlElement)) {
                document.body.removeChild(htmlElement);
            }
        }
    };

    const dataURLtoBlob = (dataUrl: string) => {
        const arr = dataUrl.split(',');
        const mimeMatch = arr[0].match(/:(.*?);/);
        const mime = mimeMatch ? mimeMatch[1] : '';
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);

        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }

        return new Blob([u8arr], { type: mime });
    };
    
    const uploadImage = async (imageBlob: string | Blob) => {
        if (!imageBlob) return null;

        const formData = new FormData();
        formData.append('file', imageBlob);

        try {
            let res:any;
            const result = await makeApiCall(
                () => new UserService().uploadFile(formData, `${Date.now()}`, 'students'),
                {
                    afterSuccess: (data: any) => {
                        res=data
                    },
                }
            );
console.log(res,"data is sreerag");

            return res?.fullPath
                ? `https://seqptsvnihezsfbnpkpz.supabase.co/storage/v1/object/public/${res.fullPath}`
                : null;
        } catch (error) {
            console.error("Error uploading image:", error);
            return null;
        }
    };

    return (
        <div className="px-8 py-3 bg-white w-[98%] mx-auto">
            <Table className="w-full">
                <TableHeader>
                    <TableRow>
                        <TableHead className="py-4">ID</TableHead>
                        <TableHead className="py-4">Name</TableHead>
                        <TableHead className="py-4">Added_By</TableHead>
                        <TableHead className="py-4">Image</TableHead>
                        <TableHead className="py-4">Card/Model Level</TableHead>
                        <TableHead className="py-4  px-2 ">QR Image</TableHead>
                        <TableHead className="py-4">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data?.map((item: any, idx: number) => (
                        <React.Fragment key={idx + 1}>
                            <TableRow>
                                <TableCell className="py-4">{item.id}</TableCell>
                                <TableCell className="py-4">
                                    {item.name}
                                    <div>Address: {item.address}</div>
                                    <div>Designation: {item.designation}</div>
                                </TableCell>
                                <TableCell className="py-4">{item.added_by}</TableCell>
                                <TableCell className="py-4">
                                    <img src={item.image} alt="profile" className="w-16 h-16 rounded-full" />
                                </TableCell>
                                <TableCell className="py-4">
                                    <div>ID No: {item.id_number}</div>
                                    <div>Card No: {item.card_number}</div>
                                    <div>Model/Level: {item.model_level}</div>
                                    <div>Company: {item.company}</div>
                                </TableCell>
                                <TableCell className="py-4">
                                    {item.card_qr_url ? (
                                        <img src={item.card_qr_url} alt="QR code" className="w-16 h-16" />
                                    ) : (
                                        <button
                                            onClick={() => generateQr(item.id, item.name)}
                                            className="bg-white p-1 px-2  flex rounded-md w-[78%] border-primary border text-primary"
                                        >
                                            Generate QR
                                        </button>
                                    )}
                                </TableCell>
                                <TableCell className="py-4">
                                    <div className="flex space-x-2">
                                        <button onClick={() => handleEditClick(idx + 1)} className="text-red-500">
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
                                        <TableCell colSpan={7}>
                                            <div className="overflow-hidden">
                                                <EditPopup onClose={handleCloseEdit} id={Number(item.id)} />
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
