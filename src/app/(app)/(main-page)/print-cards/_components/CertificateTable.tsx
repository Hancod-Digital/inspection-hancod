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
import { toJpeg, toPng, toSvg } from 'html-to-image';
import { UserService } from '@/services/api/user-service';
import TableSpinner from '@/components/animated/TableSpinner';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { AvatarFallback } from '@/components/ui/avatar';
import { formatDateWithHyphen } from '@/lib/utils';

export default function CertificateTable({ data, changed, setChanged }: { data: any, changed: boolean, setChanged: any }) {
    const [editingRow, setEditingRow] = useState<number | null>(null);
    const [htmlContent, setHtmlContent] = useState('');
    const [isGenerating, setIsGenerating] = useState<number | null>(null);

    const fetchHtml = async (profile_url: string, qr_url: string, name: string, id_no: string, company: string, designation: string, issued_on: string, valid_untill: string, course_duration: string) => {
        const response = await fetch('/blank_certificate/certificate.html'); // Replace with the correct path
        let htmlString = await response.text();

        // Replace placeholders for dynamic URLs
        htmlString = htmlString.replace(/\{\{profilePhotoUrl\}\}/g, profile_url);
        htmlString = htmlString.replace(/\{\{qrCodeUrl\}\}/g, qr_url);
        htmlString = htmlString.replace(/\{\{IDNumber\}\}/g, id_no);
        htmlString = htmlString.replace(/\{\{Company\}\}/g, company);
        htmlString = htmlString.replace(/\{\{Training\}\}/g, designation);

        // Replace the placeholder name in the span
        htmlString = htmlString.replace(/<span class="name-text">.*?<\/span>/, `<span class="name-text">${name}</span>`);
        htmlString = htmlString.replace(/<span class="date">.*?<br\s*\/>.*?<\/span>/, `<span class="date">${issued_on}<br />${valid_untill}</span>`);
        htmlString = htmlString.replace(/<span\s*class="day">.*?<\/span>/, `<span class="day">${course_duration} ${parseInt(course_duration) > 1 ? " days" : "day"}</span>`);

        setHtmlContent(htmlString);
        return htmlString;
    };

    const handleEditClick = (slNo: number) => {
        setEditingRow(slNo === editingRow ? null : slNo);
    };

    const handleCloseEdit = () => {
        setEditingRow(null);
    };

    const generateCertificate = async (item: any) => {
        try {
            console.log(item?.id);

            setIsGenerating(item?.id); // Set the current row's id as generating
            const htmlElement = document.createElement('div');

            htmlElement.innerHTML = await fetchHtml(item?.avatar, item?.qr_url, item?.name, item?.id_no, item?.company, item?.designation, formatDateWithHyphen(item?.issued_on), formatDateWithHyphen(item?.valid_untill), item?.course_duration);

            document.body.appendChild(htmlElement);
            htmlElement.style.width = '794px';
            htmlElement.style.height = '1123px';
            const dataUrl = await toPng(htmlElement, {
                width: 794,
                height: 1123,
                pixelRatio: 1,
            });

            document.body.removeChild(htmlElement); // Clean up
            const imageBlob = dataURLtoBlob(dataUrl);
            const certificateUrl = await uploadImage(imageBlob);

            if (certificateUrl) {
                await makeApiCall(
                    () => new StudentService().updateStudentCertificateUrl(item?.id, certificateUrl),
                    { afterSuccess: (data: any) => { } }
                );

                // const qrDataUrl = await QRCode.toDataURL(certificateUrl, {
                //     width: 300,
                //     errorCorrectionLevel: 'H',
                // });

                // const qrImageBlob = dataURLtoBlob(qrDataUrl);
                // const qrImageUrl = await uploadImage(qrImageBlob);

                // if (qrImageUrl) {
                //     await makeApiCall(
                //         () => new StudentService().updateStudentCertificateQRUrl(item?.id, qrImageUrl),
                //         { afterSuccess: (data: any) => {} }
                //     );
                //     toastWithTimeout(ToastVariant.Success, "Certificate and QR code created successfully.");
                // } else {
                //     toastWithTimeout(ToastVariant.Error, "Failed to upload QR image.");
                // }
                toastWithTimeout(ToastVariant.Success, "Certificate Recreated successfully.");
            } else {
                toastWithTimeout(ToastVariant.Error, "Failed to upload certificate image.");
            }
            setChanged(!changed);

        } catch (error) {
            console.error("Error generating certificate:", error);
            toastWithTimeout(ToastVariant.Error, "An error occurred while generating the certificate.");
        } finally {
            setIsGenerating(null); // Reset after completion
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

        let res: any;
        await makeApiCall(
            () => new UserService().uploadFile(formData, `${Date.now()}`, 'students'),
            { afterSuccess: (data: any) => { res = data; } }
        );

        return res?.fullPath
            ? `https://seqptsvnihezsfbnpkpz.supabase.co/storage/v1/object/public/${res.fullPath}`
            : null;
    };
    const printCertificate = (certificateUrl: string, item: any) => {
        const url = `${certificateUrl}?name=${encodeURIComponent(item.name)}&id_number=${encodeURIComponent(item.id_number)}&company=${encodeURIComponent(item.company)}&designation=${encodeURIComponent(item.designation)}&model_level=${encodeURIComponent(item.model_level)}&issued_on=${encodeURIComponent(formatDateWithHyphen(item?.issued_on))}&valid_until=${encodeURIComponent(formatDateWithHyphen(item.valid_untill))}&_=${new Date().getTime()}`;
    
        const iframe:any = document.createElement('iframe');
        iframe.style.visibility = 'hidden';
        iframe.style.position = 'fixed';
        iframe.style.right = '0';
        iframe.style.bottom = '0';
        iframe.srcdoc = `
            <!DOCTYPE html>
            <html>
            <head>
              <title>Print Content</title>
              <style>
                @page {
                  size: A4; /* Change to 'Letter' if needed */
                  margin: 0; /* Remove default margins */
                }
                body {
                  margin: 0;
                }
                img {
                  width: 100%;
                  height: auto;
                  display: block;
                }
              </style>
            </head>
            <body>
              <img src="${url}" alt="Certificate" id="certificateImage" />
              <script>
                window.onload = function() {
                  window.print();
                };
              </script>
            </body>
            </html>
        `;
        document.body.appendChild(iframe);
    
        iframe.onload = function() {
            iframe.contentWindow?.focus();
            iframe.contentWindow?.print();
    
            // Remove the iframe after printing
            iframe.contentWindow.onafterprint = function() {
                document.body.removeChild(iframe);
            };
        };
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
                                    <Avatar className="mb-2 w-16 h-16">
                                        <AvatarImage
                                            className="object-cover w-full h-full"
                                            alt="User's avatar"
                                            src={item?.avatar}
                                        />
                                        <AvatarFallback>{item?.name}</AvatarFallback>
                                    </Avatar>
                                </TableCell>
                                <TableCell className="py-4">
                                    <div>ID No: {item?.id_no}</div>
                                    <div>Card No: {item?.card_no}</div>
                                    <div>Model/Level: {item?.model_level}</div>
                                    <div>Company: {item?.company}</div>
                                    <div>Issued on: {formatDateWithHyphen(item?.issued_on)}</div>
                                    <div>Valid Until: {formatDateWithHyphen(item?.valid_untill)}</div>
                                </TableCell>
                                <TableCell className="py-4">
                                    {isGenerating === item?.id ? (
                                        <TableSpinner />
                                    ) : (
                                        !item?.qr_url ? "QR not found" : <img src={item?.qr_url} alt="QR code" className="w-16 h-16" />
                                    )}
                                </TableCell>
                                <TableCell className="py-4">
                                    <div className="flex flex-col gap-2 ">
                                        <>
                                            {!item?.certificate_url && (
                                                <button onClick={async () => await generateCertificate(item)} className="bg-white py-1 rounded-md w-[78%] border-primary border text-primary">
                                                    Certificate
                                                </button>
                                            )}

                                            {item?.certificate_url && (
                                                <>
                                                    <button onClick={async () => await generateCertificate(item)} className="bg-white py-1 rounded-md w-4/5 border-primary border text-primary mb-2">
                                                        Re-create
                                                    </button>
                                                    <button onClick={() => printCertificate(item.certificate_url, item)} className="bg-white py-1 rounded-md w-4/5 border-primary border text-primary">
                                                        Print
                                                    </button>
                                                </>
                                            )}
                                        </>
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
