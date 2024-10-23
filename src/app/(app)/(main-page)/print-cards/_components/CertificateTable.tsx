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

export default function CertificateTable({ data, changed, setChanged }: { data: any, changed: boolean, setChanged: any }) {
    const [editingRow, setEditingRow] = useState<number | null>(null);
    const [htmlContent, setHtmlContent] = useState('');

   
        const fetchHtml = async (profile_url:string,qr_url:string,name:string,id_no:string,company:string,designation:string) => {
            
                const response = await fetch('/blank_certificate/certificate.html'); // Replace with the correct path
                let htmlString = await response.text();
                console.log(qr_url,"qr_rull");
                // Replace placeholders for dynamic URLs
                htmlString = htmlString.replace(/\{\{profilePhotoUrl\}\}/g, profile_url);
                htmlString = htmlString.replace(/\{\{qrCodeUrl\}\}/g, qr_url);
                htmlString = htmlString.replace(/\{\{IDNumber\}\}/g, id_no);
                htmlString = htmlString.replace(/\{\{Company\}\}/g, company);
                htmlString = htmlString.replace(/\{\{Training\}\}/g, designation);
                
                // Replace the placeholder name in the span
                htmlString = htmlString.replace(/<span class="name-text">.*?<\/span>/, `<span class="name-text">${name}</span>`);
                console.log(htmlString);

                setHtmlContent(htmlString);
                return htmlString
            }
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

    const generateCertificate = async (item:any) => {
        try {
            // Create an HTML template for the certificate
            const htmlElement = document.createElement('div');

            htmlElement.innerHTML = await fetchHtml(item?.avatar,item?.qr_url,item?.name,item?.id_no,item?.company,item?.designation)

            // Append the element to the body temporarily
            document.body.appendChild(htmlElement);
            // Add a small delay to ensure styles are applied
            setTimeout(() => {
                console.log(htmlElement.outerHTML);
            }, 3000);

            htmlElement.style.width = '794px';  // A4 width in pixels at 96 DPI
            htmlElement.style.height = '1123px'; // A4 height in pixels at 96 DPI
            // Convert the HTML element to an image (Data URL)
            const dataUrl = await toPng(htmlElement, {
                width: 794, // A4 width in pixels at 96 DPI
                height: 1123, // A4 height in pixels at 96 DPI
                pixelRatio: 1, // Adjust if you want higher resolution
            });
            
            console.log(dataUrl);

            document.body.removeChild(htmlElement);  // Clean up

            // Convert Data URL to Blob
            const imageBlob = dataURLtoBlob(dataUrl);

            // Upload the certificate image and get its URL
            const certificateUrl = await uploadImage(imageBlob);

            if (certificateUrl) {
                // Save the certificate URL to the database
                await makeApiCall(
                    () => new StudentService().updateStudentCertificateUrl(item?.id, certificateUrl),
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
                            () => new StudentService().updateStudentCertificateQRUrl(item?.id, qrImageUrl),
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

        let res: any;
        await makeApiCall(
            () => new UserService().uploadFile(formData, `${Date.now()}`, 'students'),
            {
                afterSuccess: (data: any) => {
                    res = data;
                },
            }
        );
        console.log(res);

        return res?.fullPath
            ? `https://seqptsvnihezsfbnpkpz.supabase.co/storage/v1/object/public/${res.fullPath}`
            : null;
    };
    const printCertificate = (certificateUrl:string, item:any) => {
        // Construct the URL with query parameters
        const url = `${certificateUrl}?name=${encodeURIComponent(item.name)}&id_number=${encodeURIComponent(item.id_number)}&company=${encodeURIComponent(item.company)}&designation=${encodeURIComponent(item.designation)}&model_level=${encodeURIComponent(item.model_level)}&issued_on=${encodeURIComponent(item.issued_on)}&valid_until=${encodeURIComponent(item.valid_until)}`;
      
        const printWindow = window.open('', '_blank', 'width=793,height=1123');

        if (printWindow) {
          printWindow.document.open();
          printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
              <title>Print HTML Content</title>
            </head>
            <body>
              <img src="${certificateUrl}" alt="Certificate" id="certificateImage" />
              <script>
                // Wait for the image to load before printing
                const image = document.getElementById('certificateImage');
                image.onload = function() {
                  window.print();
                  window.close();
                };
              </script>
            </body>
            </html>
          `);
          printWindow.document.close(); // Important to close the document
          printWindow.focus(); // Ensure the window is focused
        }
    }
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
                                    {!item?.qr_url ? "QR not found" : <img src={item?.qr_url} alt="QR code" className="w-16 h-16" />}

                                </TableCell>
                                <TableCell className="py-4">
                                    <div className="flex flex-col gap-2 ">
                                        {!item?.certificate_url && <button onClick={() => generateCertificate(item)} className="bg-white py-1 rounded-md w-[78%] border-primary border text-primary">
                                            Certificate
                                        </button>}

                                        {item?.certificate_url && (
                                            <>
                                                <button onClick={() => generateCertificate(item)} className="bg-white py-1 rounded-md w-4/5 border-primary border text-primary mb-2">
                                                    Re-create
                                                </button>
                                                <button onClick={() => printCertificate(item.certificate_url, item)} className="bg-white py-1 rounded-md w-4/5 border-primary border text-primary">
                                                    Print
                                                </button>
                                            </>
                                        )}

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
