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
import { makeApiCall } from '@/lib/apicaller';
import { StudentService } from '@/services/api/students-service';
import { ToastVariant, toastWithTimeout } from '@/components/ui/use-toast';
import QRCode from 'qrcode';
import { toPng } from 'html-to-image';
import { UserService } from '@/services/api/user-service';

export default function CertificateTable({ data,changed,setChanged }: { data:any,changed: boolean,setChanged:any }) {
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

    const handleEditClick = (slNo: number) => {
        setEditingRow(slNo === editingRow ? null : slNo);
    };

    const handleCloseEdit = () => {
        setEditingRow(null);
    };

    const generateCertificate = async (id: number, name: string) => {
        try {
            // Create an HTML template for the certificate
            const htmlElement = document.createElement('div');
            htmlElement.style.width = '600px';
            htmlElement.style.height = '400px';
            htmlElement.style.display = 'flex';
            htmlElement.style.alignItems = 'center';
            htmlElement.style.justifyContent = 'center';
            htmlElement.style.flexDirection = 'column';
            htmlElement.style.backgroundColor = '#fff';
            htmlElement.style.border = '2px solid #000';
            htmlElement.innerHTML = `
                <div style="text-align: center;">
                    <h1 style="font-size: 24px;">Certificate of Achievement</h1>
                    <p>This is to certify that</p>
                    <h2 style="font-size: 20px;">${name}</h2>
                    <p>has successfully completed the course</p>
                    <p>Date: ${new Date().toLocaleDateString()}</p>
                </div>
            `;

            // Append the element to the body temporarily
            document.body.appendChild(htmlElement);

            // Convert the HTML element to an image (Data URL)
            const dataUrl = await toPng(htmlElement);
            document.body.removeChild(htmlElement);  // Clean up

            // Convert Data URL to Blob
            const imageBlob = dataURLtoBlob(dataUrl);

            // Upload the certificate image and get its URL
            const certificateUrl = await uploadImage(imageBlob);

            if (certificateUrl) {
                // Save the certificate URL to the database
                await makeApiCall(
                    () => new StudentService().updateStudentCertificateUrl(id, certificateUrl),
                    {
                        afterSuccess: (data: any) => {
                            console.log('Certificate URL updated:', data);
                        },
                    }
                );

                // Generate a QR code for the certificate URL
                const qrDataUrl = await QRCode.toDataURL(certificateUrl, {
                    width: 300,
                    errorCorrectionLevel: 'H',
                });

                // Convert the QR code Data URL to Blob
                const qrImageBlob = dataURLtoBlob(qrDataUrl);

                // Upload the QR code image and get its URL
                const qrImageUrl = await uploadImage(qrImageBlob);

                if (qrImageUrl) {
                    // Save the QR code URL to the database
                    await makeApiCall(
                        () => new StudentService().updateStudentCertificateQRUrl(id, qrImageUrl),
                        {
                            afterSuccess: (data: any) => {
                                console.log('Certificate QR URL updated:', data);
                            },
                        }
                    );
                     
                    toastWithTimeout(ToastVariant.Success, "Certificate and QR code created successfully.");
                } else {
                    toastWithTimeout(ToastVariant.Error, "Failed to upload QR image.");
                }
            } else {
                toastWithTimeout(ToastVariant.Error, "Failed to upload certificate image.");
            }
            setChanged(!changed)
        } catch (error) {
            console.error("Error generating certificate:", error);
            toastWithTimeout(ToastVariant.Error, "An error occurred while generating the certificate.");
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

    const uploadImage = async (imageBlob: Blob) => {
        const formData = new FormData();
        formData.append('file', imageBlob);

        let res:any;
        await makeApiCall(
            () => new UserService().uploadFile(formData, `${Date.now()}`, 'students'),
            {
                afterSuccess: (data:any) => {
                    res = data;
                },
            }
        );
        console.log(res);
        
        return res?.fullPath
            ? `https://seqptsvnihezsfbnpkpz.supabase.co/storage/v1/object/public/${res.fullPath}`
            : null;
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
                                    {!item?.certificate_qr_url ? "QR not found" : <img src={item?.certificate_qr_url} alt="QR code" className="w-16 h-16" />}
                                    
                                </TableCell>
                                <TableCell className="py-4">
                                    <div className="flex flex-col gap-2 ">
                    {!item?.certificate_qr_url &&<button onClick={() => generateCertificate(item.id, item.name)} className="bg-white py-1 rounded-md w-[78%] border-primary border text-primary">
                                            Certificate 
                                        </button>}
                                        
                                        {item?.certificate_url && <button onClick={() => generateCertificate(item.id, item.name)} className="bg-white py-1 rounded-md w-4/5 border-primary border text-primary">
                                            Re-create 
                                        </button>}
                                        
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
