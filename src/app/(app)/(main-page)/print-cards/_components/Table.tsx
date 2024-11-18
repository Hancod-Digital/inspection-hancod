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
import { toPng, toJpeg, toSvg } from 'html-to-image';
import html2canvas from 'html2canvas';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import DeleteDialogue from '@/components/ui/delete-dialog';
import ActionButtonIcon from '@/components/icons/ActionButtonIcon';
import { dataURLtoBlob, fetchHtml, loadImages } from '@/lib/utils';
import { AvatarFallback } from '@/components/ui/avatar';
import { Avatar, AvatarImage } from '@/components/ui/avatar';

export default function EquipmentTable({ data, setChanged, changed }: { data: any, setChanged: any, changed: boolean }) {
    const [editingRow, setEditingRow] = useState<any>(null);




    const handleEditClick = (slNo: number) => {
        setEditingRow(slNo === editingRow ? null : slNo!);
    };

    const handleCloseEdit = () => {
        setEditingRow(null);
    };
    

    const generateQr = async (item:any) => {
        try {
           
            // Create an HTML template for the card
            const htmlElement = document.createElement('div');
            htmlElement.innerHTML = await fetchHtml(item);

            // Append the element to the body temporarily
            document.body.appendChild(htmlElement);
            await loadImages(htmlElement);

          

            // Convert the HTML element to a PNG image
            const dataUrl = await toPng(htmlElement, {
                quality: 0.95,
                width: htmlElement.offsetWidth,
                height: htmlElement.offsetHeight,
            });

            // Remove the temporary element
            document.body.removeChild(htmlElement);

            // Convert Data URL to Blob
            const imageBlob = dataURLtoBlob(dataUrl);

            // Upload the card image and get its URL
            const cardImageUrl = await uploadImage(imageBlob);

            if (cardImageUrl) {
                // Update the student's card_url in the database
                await makeApiCall(
                    () => new StudentService().updateStudentCardUrl(item?.id, cardImageUrl),
                    {
                        afterSuccess: (data: any) => {
                        
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
                        () => new StudentService().updateStudentQRUrl(item?.id, qrImageUrl),
                        {
                            afterSuccess: (data: any) => {
                         
                            },
                        }
                    );

                    setChanged(!changed);
                    toastWithTimeout(ToastVariant.Success, "Card and QR code created successfully.");
                } else {
                    toastWithTimeout(ToastVariant.Error, "Failed to upload QR image.");
                }
            } else {
                toastWithTimeout(ToastVariant.Error, "Failed to upload card image.");
            }
        } catch (error) {
            console.error("Error generating QR code:", error);
            toastWithTimeout(ToastVariant.Error, "An error occurred while generating the QR code.");
        }
    };

    

    
    const deleteRecord = async (id:number) => {
        makeApiCall(
            () => new StudentService().deleteStudent(id.toString()),
            {
                afterSuccess: () => {
                    toastWithTimeout(ToastVariant.Success, "Deleted successfully");
                    setChanged(!changed);
                }
            }
        )
    }
    const uploadImage = async (imageBlob: string | Blob) => {
        if (!imageBlob) return null;

        const formData = new FormData();
        formData.append('file', imageBlob);

        try {
            let res: any;
            const result = await makeApiCall(
                () => new UserService().uploadFile(formData, `${Date.now()}`, 'students'),
                {
                    afterSuccess: (data: any) => {
                        res = data
                    },
                }
            ); 

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
                                <Avatar className="mb-2 w-16 h-16">
                  <AvatarImage
                    className="object-cover w-full h-full"
                    alt="User's avatar"
                    src={item?.avatar}
                  />
                  <AvatarFallback>{item?.name?.charAt(0)}</AvatarFallback>
                </Avatar>
                                {/* <AvatarWithTooltip item={userItem} tooltipPosition="top" /> */}
                </TableCell>
                                <TableCell className="py-4">
                                    <div>ID No: {item.id_no}</div>
                                    <div>Card No: {item.card_no}</div>
                                    <div>Model/Level: {item.model_level}</div>
                                    <div>Company: {item.company}</div>
                                </TableCell>
                                <TableCell className="py-4">
                                    {item.qr_url ? (
                                        <AvatarWithTooltip item={item} tooltipPosition="top" />
                                      
                                    ) : (
                                        <button
                                            onClick={() => generateQr(item)}
                                            className="bg-white p-1 px-2 flex rounded-md  border-primary border text-primary"
                                        >
                                            Generate QR
                                        </button>
                                    )}
                                </TableCell>
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
                                        <TableCell colSpan={7}>
                                            <div className="overflow-hidden">
                                                <EditPopup onClose={handleCloseEdit} id={Number(item.id)} setChanged={setChanged} changed={changed} userData={item} />
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


export const AvatarWithTooltip = ({ item, tooltipPosition = 'top' }:any) => {
    return (
      <div className={`tooltip ${tooltipPosition}`}>
         <img src={item.qr_url} alt="QR code" className="w-16 h-16" />
        <span className="tooltiptext">
          <img
            src={item.qr_url}
            alt="Tooltip Image"
            style={{ width: '150px', height: 'auto' }} // Adjust size as needed
          />
        </span>
      </div>
    );
  };