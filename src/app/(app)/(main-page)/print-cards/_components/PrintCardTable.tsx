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
import QRCode from 'qrcode';

import EditIcon from '@/components/icons/EditIcon';
import DeleteIcon from '@/components/icons/DeleteIcon';
import { Button } from '@/components/ui/button';
import { makeApiCall } from '@/lib/apicaller';
import { StudentService } from '@/services/api/students-service';
import { ToastVariant, toastWithTimeout } from '@/components/ui/use-toast';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import ActionButtonIcon from '@/components/icons/ActionButtonIcon';
import { cssString, dataURLtoBlob, fetchHtml, formatDateWithHyphen, loadImages, splitDesignation } from '@/lib/utils';
import { toPng } from 'html-to-image';
import { UserService } from '@/services/api/user-service';
import TableSpinner from '@/components/animated/TableSpinner';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function PrintCardTable({ data, changed, setChanged }: { data: any, changed: boolean, setChanged: any }) {
  const [editingRow, setEditingRow] = useState<number | null>(null);
  const [isGenerating, setIsGenerating] = useState<number | null>(null);


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

  const generateQr = async (item: any) => {
    setIsGenerating(item.id);
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
    } finally {
      setIsGenerating(null);
    }
  };
 
  const handleEditClick = (item: any) => {
    const {training, training1} = splitDesignation(item?.designation)
    const {training:model_level, training1:model_level1} = splitDesignation(item?.model_level)
    const iframe: any = document.createElement('iframe');
    iframe.style.visibility = 'hidden';
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';

    iframe.srcdoc = `
           <!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap" />
 <style>
  ${cssString(item)}
 </style>
  </head>
  <body>
    <div class="main-container">
      <div class="rectangle"></div>
      <div class="whatsapp-image"></div>
    <div class="apply-style">
        <img style="object-fit: cover;" width="100%" height="100%" src="https://seqptsvnihezsfbnpkpz.supabase.co/storage/v1/object/public/students/filename1731402831919_cropped_image.jpeg" alt="">
      </div>
      <span class="sheik-hameed-khan">${item?.name}</span>
      <div class="flex-row-b">
        <div class="nome">
          <span class="apparicio-junior">${item?.certificate_no}<br /><br /></span>
        </div>
        <div class="line"></div>
        <span class="qatar-id-company"
          >Qatar ID/ ID No.: <br />Company name:<br />Course Details:<br /><br />Model/
          Level:</span
        ><span class="qube-inspection"
          >${item?.id_no}<br />Qube Inspection<br /><br /><br /></span
        ><span class="safe-building-operator"
          >${training} <br />${training1}</span
        ><span class="safety-model-operator"
          >${model_level} <br />${model_level1}</span
        >
      </div>
      <div class="line-1"></div>
      <div class="flex-row-baa">
        <div class="vector">
         
          
         
        </div>
        <span class="date-range">${formatDateWithHyphen(item?.issued_on)}<br />${formatDateWithHyphen(item?.valid_untill)}</span
        ><span class="date-info">Issued Date: <br />Expiry Date:</span
        ><span class="qr-code">Scan QR code to verify this card</span>
      </div>
      <div class="rectangle-15a"></div>
      <div class="shape"></div>
    </div>
    <script>
      window.onload = function() {
        window.print();
        window.close();
      };
    </script>
  </body>
</html>

          `
    document.body.appendChild(iframe);

    iframe.onload = function () {
      iframe.contentWindow.focus();
      iframe.contentWindow.print();

      // Remove the iframe after printing
      iframe.contentWindow.onafterprint = function () {
        document.body.removeChild(iframe);
      };
    };
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
                <TableCell className="py-4"><Avatar className="mb-2 w-16 h-16">
                  <AvatarImage
                    className="object-cover w-full h-full"
                    alt="User's avatar"
                    src={item?.avatar}
                  />
                  <AvatarFallback>{item?.name?.charAt(0)}</AvatarFallback>
                </Avatar></TableCell>
                <TableCell className="py-4">
                  <div>ID No: {item?.id_no}</div>
                  <div>Card No: {item?.card_no}</div>
                  <div>Model/Level: {item?.model_level}</div>
                  <div>Company: {item?.company}</div>
                  <div>Issued on: {formatDateWithHyphen(item?.issued_on)}</div>
                  <div>Valid Until: {formatDateWithHyphen(item?.valid_untill)}</div>
                </TableCell>
                <TableCell className="py-4">
                  {isGenerating === item.id ? <TableSpinner /> : <img src={item?.qr_url} alt="QR code" className="w-16 h-16" />}
                </TableCell>
                <TableCell className="py-4">


                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button>
                        <ActionButtonIcon />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => handleEditClick(item)}>

                        Print
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => generateQr(item)}>

                        Recreate QR
                      </DropdownMenuItem>

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
